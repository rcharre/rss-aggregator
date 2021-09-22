const DatabaseChangelog = require('../../domain/DatabaseChangelog')
const path = './changelogs/'
const changelogs = [
    '20210922_leMondeSource_international.js'
]


module.exports = async function () {
    for (let changelogFileName of changelogs) {
        let existing = await DatabaseChangelog.findOne({ name: changelogFileName })
        let changelogEntry = !!existing ?
            existing :
            new DatabaseChangelog({
                name: changelogFileName,
                executed: false
            })

        if (!changelogEntry.executed) {
            let changelog = require(path + changelogFileName)
            await changelog()
            changelogEntry.executed = true
            await changelogEntry.save()
            console.log('Executed changelog ' + changelogFileName)
        }
    }
}