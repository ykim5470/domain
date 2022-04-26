'use strict'

const express = require('express')
const { v4: uuidV4 } = require('uuid')
const router = express.Router()

const liveThumbnailMulterSet = require('../middle/liveThumbnailMulter')
const recResourceUpload = require('../middle/recUploadMulter')
const testUpload = require('../middle/testUpload')
const fileSizeFormatter = require('../helpers/fileUploaderController')
<<<<<<< HEAD


=======
const testUpload = require('../middle/testUpload')
>>>>>>> a94ab28c583875491871a31f65e4212e1f2841cf
const Models = require('../../../models')


router.get('/createRoomNumber', (req, res) => {
  const randomRoomId = uuidV4()
  try {
    return res.status(200).json({ roomId: randomRoomId })
  } catch (err) {
    return res.status(404).json(err)
  }
})


router.get('/guideRoomList', async (req, res) => {

   let roomList = await Models.Channel.findAll({
   include: [
     {
       model: Models.ChannelSetConfig,
       as: 'setConfig',
       attributes: ['Title', 'Host', 'Thumbnail', 'RoomCategory', 'CreatedAt']
     }
   ],
  //  where:{IsActivate: 1}, guide id will be received from reqest query 
   attributes: ['RoomId']
  })

  const roomListObject = JSON.parse(JSON.stringify(roomList, null, 2))


  res.status(200).json(roomListObject)

})

router.get('/roomList', async (req, res) => {

  let roomList = await Models.Channel.findAll({
  include: [
    {
      model: Models.ChannelSetConfig,
      as: 'setConfig',
      attributes: ['Title', 'Host', 'Thumbnail', 'RoomCategory', 'CreatedAt']
    }
  ],
  where:{IsActivate: 1},
  attributes: ['RoomId']
 })

 const roomListObject = JSON.parse(JSON.stringify(roomList, null, 2))


 res.status(200).json(roomListObject)

})

/**
 * @param {req.body} - title, host, roomId
 * @param {req.file} - thumbnail data
 */
router.post('/roomCreate', liveThumbnailMulterSet.single('thumbnail'), async (req, res) => {
  try{
  const {
    title,
    host,
    roomId,
    roomCategory,
    storePath,
    storeCategory,
    storeId,
    productId,
  } = req.body
  const { fieldname, originalname, destination, filename, path, size } =
    req.file

  console.log(req.file)


  await Models.Channel.create({
    RoomId: roomId,
  })

  await Models.ChannelSetConfig.create({
    RoomId: roomId,
    Title: title,
    Host: host,
    Thumbnail: filename,
    RoomCategory: roomCategory,
  }).then((result) => {    
    return result
  })

  await Models.ChannelProductConfig.create({
    RoomId: roomId,
    StorePath: storePath,
    StoreCategory: storeCategory,
    StoreId: storeId,
    ProductId: productId,
  })

  res.status(200).json('roomCreate sucess')
}catch(err){
  res.status(400).json(err)
}
})


router.post('/createChatLog', async(req,res) =>{
 try{
	//console.log(req.app.get('io'))
	//console.log('채팅 생성 요청 받음')
	const {RoomId, User, Text} = req.body
	await Models.ChannelChatLog.create({
		RoomId: RoomId,
		User: User,
		Text: Text
	})
	res.status(200).json('Chat log added')
	}catch(err){
	res.status(400).json(err)}
 })


router.post('/recordMediaUpload',recResourceUpload.array('resources',  2), async(req,res)=>{
  try{
    const {roomId, title, host, roomCategory} = req.body
    
    console.log(req.body)
    let filesArray = []
    req.files.forEach(el => {
      const file = {
        fileName: el.originalname,
        filePath: el.path,
        fileType: el.mimetype, 
        fileSize: fileSizeFormatter(el.size,2)
      }
      filesArray.push(file)
    })
    
    let thumbnail = {}
    let media = {}
    if(filesArray.length !== 2){
      throw Error('Invalid upload count')
    }else{
      filesArray.map((el,idx) => {
        if(el.fileType.split('/')[0] === 'image') {return thumbnail = {...filesArray[idx]}}
        if(el.fileType.split('/')[0] === 'video')  {return media = {...filesArray[idx]}}
      })
    }
    
    await Models.ChannelRecordManagementConfig.create({
      RoomId: roomId,
      Media: media.fileName,
      FileSize: media.fileSize,
      Thumbnail: thumbnail.fileName,
      Title: title, 
      Host: host,
      RoomCategory:roomCategory,
    })

    
  res.status(200).json('recordMediaUpload success')
  }catch(err){
    console.log(err)
    res.status(400).json(err)
  }
})


/**
 * 인터뷰 과제 
 */
router.get('/userInfo', async(req,res)=>{
  let userList = await Models.User.findAll({
    attributes: ['User', 'Role', 'Msg', 'id']
  })
	console.log('get 요청')
  return res.status(200).json(userList)
})

router.post('/registerUserInfo', async(req,res)=>{
<<<<<<< HEAD
  const [name, role, message] = req.body
=======
  const {name, role, message} = req.body
>>>>>>> a94ab28c583875491871a31f65e4212e1f2841cf
  await Models.User.create({
    User: name,
    Role: role, 
    Msg: message
  })
	console.log('post 요청')
  return res.status(200).json('User Information Registered Successfully!')
})

router.put('/updateUserInfo', async(req,res) =>{
<<<<<<< HEAD
  const [id, name, role, message] = req.body
=======
  const {id, name, role, message} = req.body
>>>>>>> a94ab28c583875491871a31f65e4212e1f2841cf
  await Models.User.update(
   {User: name, Role: role, Msg: message},
   {where: {id: id}}
  )
	console.log('put 요청')
  return res.status(200).json('User Information Updated Successfully!')
})

router.delete('/deleteUserInfo', async(req,res)=>{
<<<<<<< HEAD
  const [id] = req.body
=======
  const {id} = req.body
>>>>>>> a94ab28c583875491871a31f65e4212e1f2841cf
    await Models.User.destroy({
    where: {id: id}
  })
	console.log('delete 요청')
  return res.status(200).json('User Information Deleted Successfully!')
})

<<<<<<< HEAD


=======
>>>>>>> a94ab28c583875491871a31f65e4212e1f2841cf
/**
 * 인터뷰 과제2 
 */
router.get('/contents', async(req,res)=>{
  // let imagePath = 
  let roomConfig = await Models.Room.findAll({
    attributes: ['id', 'Image', 'Room', 'createdAt', 'updatedAt']
  })
<<<<<<< HEAD
  console.log(roomConfig)
=======
>>>>>>> a94ab28c583875491871a31f65e4212e1f2841cf
  return res.status(200).json(roomConfig)
})

router.post('/createContent',testUpload.single('image'),async(req,res)=>{
  const {room} = req.body
  const {filename} = req.file

  console.log(req.file)
  console.log(req.body)
  await Models.Room.create({
    Image: filename,
    Room: room
  })
  return res.status(200).json('Content Created Successfully!')
})

router.put('/updateContent', testUpload.single('image'),async(req,res)=>{
  const {id, room} = req.body
  const {filename} = req.file
  await Models.Room.update({
    Image: filename, Room: room},
    {where: {id: id}}
  )
  return res.status(200).json('Content Information Updated Successfully!')
})

router.delete('/deleteContent', async(req,res)=>{
  const {id} = req.body
  await Models.Room.destroy({
    where: {id: id}
  })
  return res.status(200).json('Content Information Deleted Successfully!')
})

module.exports = router
