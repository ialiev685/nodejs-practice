const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
dotenv.config({
    path: './config/.env'
})
const connectDB = require('./config/db')
const User = require('./model/user')


const {PORT}= process.env
const app = express()
app.use(express.json())
app.use(cors())

//route register
app.post('/register', async (req, res) => {
    //получаем данные от пользователя(postman или форма)
    //делаем валидацию полей пользователя
    //проверка, есть ли уже пользователь
    //если есть пользователь, то сообщить, что пользователь уже был зарегистрирован
    //если пользователя нет, то хешируем пароль
    //сохраняем пользователя в БД
    //создаем JWT токен для пользователя
    //сохраняем токен в БД
    //даем ответ пользователю success


    //получаем данные от пользователя(postman или форма)
    const { firstName, lastName, email, password } = req.body
    //делаем валидацию полей пользователя
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send('Заполните все поля формы корректно')
    }
    //проверка, есть ли уже пользователь
    const user = await User.findOne({ email })
    //если есть пользователь, то сообщить, что пользователь уже был зарегистрирован
    if (user) {
        return res.status(409).send(`Пользователь с таким email: ${email} уже зарегистрирован`)
    }
     //если пользователя нет, то хешируем пароль
    const cryptedPassword = await bcrypt.hash(password, 7)
    //сохраняем пользователя в БД
    const newUser = await User.create({ firstName, lastName, email, password: cryptedPassword })
    console.log(newUser);
    //создаем JWT токен для пользователя
    const token = jwt.sign({
        user_id: newUser._id,
    }, process.env.JWT_SECRET, { expiresIn: '3h' });
    //сохраняем токен в БД
    newUser.token = token
    await newUser.save()
    //даем ответ пользователю success
    return res.status(201).send(newUser)
})
//route login
app.post('/login', async(req, res) => {
    //получаем данные от пользователя(email и пароль)
    //делаем валидацию полей пользователя
    //проверка, есть ли уже пользователь
    //проверяем пароль
    //если пользователя нет, то сообщаем, что нужно зарегистрироваться
    //если есть пользователь, проверяем токен на валидность
    //если токен валидный, то отправляем success
    //если невалидный, отправляем ошибку авторизации

    //получаем данные от пользователя(email и пароль)
    const { email, password } = req.body
    //делаем валидацию полей пользователя
    if (!email || !password) {
        return res.status(400).send('Введите логин и пароль')
    }

    //проверка, есть ли уже пользователь
    const user = await User.findOne({ email })
    //проверяем пароль
    const correctPassword = await bcrypt.compare(password, user.password)
    if (!user && !correctPassword) {
        return res.status(401).send('Неверный логин или пароль')
    }

    //если есть пользователь, проверяем токен на валидность
       const token = jwt.sign({
        user_id: user._id,
       }, process.env.JWT_SECRET, { expiresIn: '3h' });
    user.token = token
    await user.save()
    return res.status(200).send(user)
})
//route logout
app.post('/logout', async (req, res) => {
    //получаем токен из заголовков
    //расшифровываем токен
    //находим юзера по ид
    //если нашли, то меняем в базе токен на null
    //если не нашли пользователя, то токен или истек или невалиден

    //получаем токен из заголовков
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    if (!token) {
        return res.status(401).send('Пользователь не авторизован')
    }
    try {

        const { user_id } = jwt.decode(token, process.env.JWT_SECRET);
        // console.log(user_id);
        await User.findByIdAndUpdate(user_id, { token: null })
        return res.status(200).send('Logout success')
    } catch (error) {
         return res.status(401).send('Ошибка аутентификации')
    }



})

connectDB()

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

process.on('unhandledRejection', (error, _) => {
    if (error) {
        console.log(error.message)
        server.close(() => {
            return process.exit(1)
        })
    }

})