import io from 'socket.io-client'

var socket = io('http://localhost:8081')

export default socket