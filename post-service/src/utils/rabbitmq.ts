import amqp from "amqplib";
import {logger} from "./logger.js";

let channel:amqp.Channel;
const EXCHANGE_NAME="post-service";
export async function connectRabbitMQ() {
    const connection = await amqp.connect(
        process.env.RABBITMQ_URL!
    );
    channel = await connection.createChannel();
    await channel.assertExchange(
        EXCHANGE_NAME,
        "topic",
        { durable: true }
    );
    logger.info("RabbitMQ connected");
}