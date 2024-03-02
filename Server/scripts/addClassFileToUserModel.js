const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const options = { useNewUrlParser: true, useUnifiedTopology: true };

async function func() {
  // 连接数据库
  const client = await MongoClient.connect(url, options);

  // 获取库、集合
  const data = client.db('local');
  const users = data.collection('users');

  // 使用 updateMany() 添加字段 class，并设置默认值为 'Class-1'
  await users.updateMany({}, { $set: { class: '' } });

  // 关闭连接
  client.close();
}

func();
