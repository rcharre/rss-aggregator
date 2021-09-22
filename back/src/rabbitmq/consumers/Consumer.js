const amqp = require('amqplib')

class Consumer {
    constructor(queue, host, consumer) {
        this.queue = queue
        this.host = host
        this.consumer = consumer

        amqp.connect(host)
            .then(this._initAmqp.bind(this))
            .catch(console.error)
    }

    _initAmqp(connection) {
        process.once('SIGINT', () => connection.close())
        connection.createChannel()
            .then(this._initChannel.bind(this))
    }

    _initChannel(channel) {
        channel.assertQueue(this.queue, { durable: false })
            .then(qok => channel.consume(this.queue, this.consumer, { noAck: true }))
    }
}

module.exports = Consumer