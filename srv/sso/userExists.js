/**
 * This function will just be used to check that a user
 * within an active directory domain. This will return
 * a promise to allow the consuming code base to take
 * advantage of async/await syntax, making the
 * code more readable.
 *
 * @param {string} username
 * @param {ActiveDirectory} activeDirectory
 * @returns {Promise}
 */
const userExists = (username, activeDirectory) => {
  const promise = new Promise((resolve, reject) => {
    activeDirectory.userExists(username, (err, exists) => {
      if (err) {
        reject(err);
      } else if (!exists) {
        reject('User does not exist');
      } else {
        resolve(username);
      }
    });
  });

  return promise;
};

module.exports = userExists;
