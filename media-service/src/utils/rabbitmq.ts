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

export async function consumeEvent<T>(routingKey:string,callback: (data: T) => Promise<void> | void) {
    if(!channel){
        await connectRabbitMQ();
    }
    const q=await channel.assertQueue("",{exclusive:true});
    await channel.bindQueue(q.queue,EXCHANGE_NAME,routingKey);
    channel.consume(q.queue,async (message)=>{
        if(message!==null){
            const content=JSON.parse(message.content.toString());
            await callback(content);
            channel.ack(message);
        }
    })
    logger.info(`Subscribed to event ${routingKey}`);
}