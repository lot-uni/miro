require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?
require './models/count.rb'
require 'sinatra-websocket'

set :server, 'thin'
set :sockets, []

before do
  if Count.all.size == 0
    Count.create(number: 0)
  end
end

get '/' do
  @hoge = Count.first
  erb :index
end

get '/socket' do
  if request.websocket?
    request.websocket do |ws|
      ws.onopen do
        settings.sockets << ws
        hoge = Count.first
        hoge.number += 1
        hoge.save
        settings.sockets.each do |s|
          s.send({"type":"change","value":hoge.number}.to_json)
        end
      end
      ws.onmessage do |msg|
        settings.sockets.each do |s|
          s.send(msg)
        end
      end
      ws.onclose do
        settings.sockets.delete(ws)
        hoge = Count.first
        hoge.number -= 1
        hoge.save
        settings.sockets.each do |s|
          s.send({"type":"change","value":hoge.number}.to_json)
        end
      end
    end
  end
end