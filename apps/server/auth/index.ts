import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// @ts-ignore
import Crypt from "node-jsencrypt";
import { PrivateKey } from "../common";
import mysql from "mysql2";
import dayjs from "dayjs";
import {createHash} from "crypto";
import { v4 as uuidv4 } from 'uuid';

const cache = new Map()
// 连接数据库
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'mmodb'
});


const crypt = new Crypt();
crypt.setPrivateKey(PrivateKey);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/register", function (req, res) {
    console.log(req.body);
    let { account, password } = req.body;
    account = crypt.decrypt(account);
    password = crypt.decrypt(password);

    console.log(account, password);

    const hash = createHash('md5');
    hash.update(password);
    const passwordHash = hash.digest('hex');

    connection.query('INSERT INTO user (account, password, created_time) VALUES (?, ?, ?)', [account, passwordHash, dayjs().format('YYYY-MM-DD HH:mm:ss')], 
    function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
    });

    res.json({});
});

app.post("/login", function (req, res) {
    console.log(req.body);
    let { account, password } = req.body;
    account = crypt.decrypt(account);
    password = crypt.decrypt(password);

    console.log(account, password);

    const hash = createHash('md5');
    hash.update(password);
    const passwordHash = hash.digest('hex');

    connection.execute('select * from user where account = ? and password = ?', [account, passwordHash], 
    function (error, results: any[], fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
        
        if (results.length > 0) {
            const token = uuidv4();
            cache.set(token, account);
            console.log(cache);
            
            res.json({ token });

        }
    });
});

app.listen(3000, () => {
  console.log("auth 服务启动成功");
});
