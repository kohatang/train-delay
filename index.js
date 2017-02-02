/**
 * Created by k_hatano on 2017/02/02.
 */
'use strict';

const Botkit = require('botkit');
const rp = require('request-promise');
const CronJob = require('cron').CronJob;

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

const controller = Botkit.slackbot({
    debug: false
});

const bot = controller.spawn({
        token: process.env.token
    }).startRTM((err) => {
        if (err) {
            throw new Error(err);
        }
    });

const channelId = process.env.CHANNEL_ID;

let options = {
    uri: 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json',
    json: true
};

global.trains = [];

new CronJob('* */10 9-22 * * 1-5', () => {
    rp(options)
        .then((res) => {
            for (let info of res) {
                if (info.name === '山手線') {
                    if (global.trains.indexOf(info.name) === -1) {
                        bot.say({
                            text: '遅延: ' + info.name,
                            channel: channelId
                        });
                        global.trains.push(info.name);
                    }
                } else if (info.name === '京浜東北線') {
                    if (global.trains.indexOf(info.name) === -1) {
                        bot.say({
                            text: '遅延: ' + info.name,
                            channel: channelId
                        });
                        global.trains.push(info.name);
                    }
                }
            }
        });
}, null, true, 'Asia/Tokyo');

controller.hears('hi',['direct_message','direct_mention','mention'],(bot,message) => {
    bot.reply(message,'hi');
});
