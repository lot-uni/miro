require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?
require './models/count.rb'
require 'sinatra-websocket'

enable :sessions

set :server, 'thin'
set :sockets, []

before do
  if Borad.all.size == 0
    Borad.create(number_of_people: 0, game_turn: 0, resert_end: 0, play_data: "[[1,12,][]]", captured_pieces: "")
   end
end

get '/' do
  @hoge = Borad.first
  @game_turn = @hoge.game_turn
  if @hoge.number_of_people == 0&&session[:tern] == nil
    session[:tern] = "先手"
  elsif @hoge.number_of_people == 1&&session[:tern] == nil
    session[:tern] = "後手"
  elsif session[:tern] == nil
    session[:tern] = "観客"
  end
  erb :index
end

get '/socket' do
  if request.websocket?
    request.websocket do |ws|
      ws.onopen do
        settings.sockets << ws
        hoge = Borad.first
        hoge.number_of_people += 1
        hoge.save
        settings.sockets.each do |s|
          s.send({"type":"change","value":hoge.number_of_people}.to_json)
        end
      end
      ws.onmessage do |msg|
        data = JSON.parse(msg)
        case data["type"]
        when "move"
          hoge = Borad.first
          hoge.game_turn = data["game_turn"]
          hoge.save
        end
        settings.sockets.each do |s|
          s.send(msg)
        end
      end
      ws.onclose do
        settings.sockets.delete(ws)
        hoge = Borad.first
        hoge.number_of_people -= 1
        hoge.save
        settings.sockets.each do |s|
          s.send({"type":"change","value":hoge.number_of_people}.to_json)
        end
      end
    end
  end
end