const date=require('joi/lib/types/date');
const { now }=require('mongoose');
const { mongoose } = require('./connection');
const logger = require('../../lib/logger');
const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: "-",
    required: false
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    default: "-"
  },
  company: {
    type: String,
    default: "-"
  },
  type: {
    type: String,
    default: "user"
  },
  status: {
    type: String,
    default: "0"
  },
  right: {
    type: String,
    default: "-"
  },
  message: {
    type: String,
    default: "-"
  },
  location: {
    type: String,
    default: "default",
  },
  group: {
    type: String,
    default: "default",
  },
  note: {
    type: String,
    default: "-",
  },
  logo_url: {
    type: String,
    default: "-",
  },
  history_data: {
    type: String,
    default: "[]",
  }
});
const logSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  }
}, 
  { timestamps: true }
)

const deviceSchema = new mongoose.Schema({
  circuit_number: {
    type: String,
    required: true
  },
  note: {
    type: String,
    default: '-'
  }
}, 
  { timestamps: true }
)
const sessionSchema = new mongoose.Schema({
  expires: {
    type: String
  },
  session: {
    type: String
  }
})
const User = mongoose.model('User', userSchema);
const Logs = mongoose.model('Logs', logSchema);
const DeviceNote = mongoose.model('DeviceNote', deviceSchema);
const Sessions = mongoose.model('sessions', sessionSchema);
// ACS db connect
const acs_db  = mongoose.createConnection(process.env.ACS_DB_URL + 'genieacs', {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

acs_db.on('error', (e) => logger.error(e));
acs_db.once('open', () => {
  logger.info('Connected to ACS Database');
  
});
const Devices = acs_db.collection('devices');
const Tasks = acs_db.collection('tasks');
module.exports = {
  User,
  Sessions,
  Logs,
  Devices,
  DeviceNote,
  Tasks
};
