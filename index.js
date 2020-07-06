const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
} = require('./contacts.js');
const argv = require('yargs').argv;

const invokeAction = ({ action, id, name, email, phone }) => {
    switch (action.toString()) {
      case 'list':
        listContacts()
          .then(res => console.table(res))
          .catch(err => console.log(err));
        break;
  
      case 'get':
        getContactById(id)
          .then(res => console.table(res))
          .catch(err => console.log(err));
        break;
  
      case 'add':
        addContact(name, phone, email)
          .then(res => console.table(res))
          .catch(err => console.log(err));
        break;
  
      case 'remove':
        removeContact(id)
          .then(res => console.table(res))
          .catch(err => console.log(err));
        break;
  
      default:
        console.warn('\x1B[31m Unknown action type!');
    }
  }
  
  invokeAction(argv);