type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
  requestId?: string
}

const isDev = import.meta.env.DEV

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 500

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (isDev) {
      const styles: Record<LogLevel, string> = {
        debug: 'color: #888',
        info: 'color: #2196F3',
        warn: 'color: #FF9800',
        error: 'color: #F44336; font-weight: bold',
      }
      console[level === 'debug' ? 'log' : level](
        `%c[${entry.timestamp}] [${level.toUpperCase()}] ${message}`,
        styles[level],
        data ?? '',
      )
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data)
  }

  request(config: { method?: string; url?: string; params?: unknown; data?: unknown }) {
    if (isDev) {
      this.debug(`→ ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()
