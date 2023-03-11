/**
 * This function will be used to check that a user is
 * a member of a given active directory group, a typical
 * example may include 'Admin', 'Super User', etc.
 * This will return a promise to allow the consuming
 * code base to take advantage of async/await syntax,
 * making the code more readable.
 *
 * @param {String} username
 * @param {String} group
 * @param {ActiveDirectory} activeDirectory
 * @return {Promise}
 */
const isMemberOf = (username, group, activeDirectory) => {
  const promise = new Promise((resolve, reject) => {
    activeDirectory.isUserMemberOf(username, group, (err, isMember) => {
      if (err) {
        reject(err);
      } else if (!isMember) {
        reject(username + ' is not a member of ' + group);
      } else {
        resolve(isMember);
      }
    });
  });

  return promise;
};

module.exports = isMemberOf;
