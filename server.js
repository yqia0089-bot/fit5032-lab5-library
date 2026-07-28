import cors from 'cors'
import express from 'express'

const app = express()

const port =
  Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('Hello from Node.js!')
})

app.get('/health', (request, response) => {
  response.json({
    success: true,
    service: 'NoMash Library Node server',
    timestamp: new Date().toISOString(),
  })
})

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port}`,
  )
})