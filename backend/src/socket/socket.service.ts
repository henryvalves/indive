import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
  server: Server | null = null

  setServer(s: Server) {
    this.server = s
  }

  serverEmit(event: string, payload: any) {
    this.server?.emit(event, payload)
  }
}
