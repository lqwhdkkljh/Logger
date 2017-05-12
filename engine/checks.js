function checkNick (changes, member, bot) {
  if (changes.before.nick !== changes.after.nick) {
    return {
      'name': 'Nick change',
      'value': `Before: ${changes.before.nick === null ? member.username : changes.before.nick} to ${changes.after.nick === null ? member.username : changes.after.nick}`
    }
  } else {
    return false
  }
}

function checkRoleChanges (rolesAdded, rolesRemoved, member) {
  if (rolesAdded.length > 0) {
    return {
      'name': 'Role change',
      'value': `User ${member.mention} was given role *${rolesAdded[0].name}*. `
    }
  } else if (rolesRemoved.length > 0) {
    return {
      'name': 'Role change',
      'value': `*${rolesRemoved[0].name}* was revoked from user ${member.mention}.`
    }
  } else {
    return false
  }
}

export { checkNick, checkRoleChanges }
