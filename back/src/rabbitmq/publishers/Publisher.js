const amqp = require('amqplib')

class Publisher {
    constructor(queue, host) {
        this.queue = queue
        this.host = host
    }

    publish(message) {
        return amqp.connect(this.host)
            .then(connection =>
                connection.createChannel()
                    .then(ch => this._send(ch, message))
                    .catch(console.error)
                    .finally(() => connection.close()))
    }

    _send(channel, message) {
        let ok = channel.assertQueue(this.queue, { durable: false })
        return ok.then(_qok => {
            channel.sendToQueue(this.queue, Buffer.from(message))
            return channel.close()
        })
    }
}

module.exports = Publisher