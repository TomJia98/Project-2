var moment = require('moment');

module.exports = {
  format_date: (date) => {
    return moment(date).format('k:m A M/D/YYYY');
  },
};
