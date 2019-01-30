#!/usr/bin/env node

const inquirer = require('inquirer');
const moment = require('moment-timezone');

const start = [{
    name: 'start',
    type: 'confirm',
    message: 'Hi, welcome to convert-timezone. Do you want to start?'
}];

const chooseCountry = (name, message) => {
    return [
        {
            name,
            type: 'list',
            message: `Please select the ${ message }:`,
            choices: ['Africa', 'America', 'Antarctica', 'Asia', 'Australia', 'Europe']
        }
    ];
};

const chooseTimezone = (name, country, message) => {
    const timeZones = moment.tz.names().filter((item) => item.split(country).length === 2);
    return [
        {
            name,
            type: 'list',
            message: `Please select the ${ message }:`,
            choices: timeZones
        }
    ];
};

const chooseHour = (name) => {
    return [
        {
            name,
            type: 'input',
            message: 'Please input an hour:',
            validate: (input) => {
                if (/^([0-1][0-9]|2[0-4])$/.test(input)) {
                    return true;
                }
                return 'Hour must be between 00 and 24';
            }
        }
    ];
};

inquirer.prompt(start)
    .then((answers) => answers.start ? new Promise((resolve, reject) => {
        inquirer.prompt(chooseHour('hour'))
            .then((newAnswer) => {
                resolve({ ...answers, ...newAnswer });
            })
            .catch((err) => reject(err));
    }) : process.exit(0))
    .then((answers) => new Promise((resolve, reject) => {
        inquirer.prompt(chooseCountry('firstCountry', 'FROM country'))
            .then((newAnswer) => {
                resolve({ ...answers, ...newAnswer });
            })
            .catch((err) => reject(err));
    }))
    .then((answers) => new Promise((resolve, reject) => {
        inquirer.prompt(chooseTimezone('firstTimezone', answers['firstCountry'], 'FROM timezone'))
            .then((newAnswer) => {
                resolve({ ...answers, ...newAnswer });
            })
            .catch((err) => reject(err));
    }))
    .then((answers) => new Promise((resolve, reject) => {
        inquirer.prompt(chooseCountry('secondCountry', 'TO country'))
            .then((newAnswer) => {
                resolve({ ...answers, ...newAnswer });
            })
            .catch((err) => reject(err));
    }))
    .then((answers) => new Promise((resolve, reject) => {
        inquirer.prompt(chooseTimezone('secondTimezone', answers['secondCountry'], 'TO timezone'))
            .then((newAnswer) => {
                resolve({ ...answers, ...newAnswer });
            })
            .catch((err) => reject(err));
    }))
    .then((data) => {
        const today = moment().format('YYYY-MM-DD');
        const conversionResult = moment.tz(`${ today } ${ data.hour }:00`, data.firstTimezone)
            .tz(data.secondTimezone)
            .format('YYYY-MM-DD ha z');
        console.log(`Conversion result: ${ conversionResult } in ${ data.secondTimezone }`);
    })
    .catch((err) => console.error(err));
