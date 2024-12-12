const Group = require("../model/groups");
const GroupMember = require("../model/groupmembers");
const Userdetails = require("../model/userdetails");
const sequelize = require('../utils/seq');
exports.createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body; // members will be an array of emails
    const userid = req.user.id;  // Ensure req.user contains the user ID

    if (!groupName || !userid) {
      return res.status(400).json({ message: "Group name and user ID are required" });
    }

    // Create the group
    const createGroup = await Group.create({
      name: groupName,
      createdBy: userid,
    });

    // Add the user who created the group as the first member with "admin" role
    await GroupMember.create({
      userid: userid,
      groupId: createGroup.id,
      role: "admin",  // The user who creates the group is the admin
    });

    // Add additional members (if any) to the group with "member" role
    if (members && Array.isArray(members)) {
      // Iterate through the emails in the members array
      for (let email of members) {
        // Find the user by their email to get the userid
        const user = await Userdetails.findOne({
          where: { email },  // Lookup user by email
          attributes: ['id'],  // We only need the id
        });

        // If user found, add them to the group
        if (user) {
          await GroupMember.create({
            userid: user.id,  // Use the user's ID from the lookup
            groupId: createGroup.id,
            role: "member",  // Default role for other users
          });
        } else {
          console.log(`User with email ${email} not found.`);
        }
      }
    }

    // Respond with success
    res.status(201).json({
      message: "Group created successfully",
      group: createGroup,  // Returning the created group
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userid = req.user.id;  // Assuming user is authenticated and their id is in `req.user.id`

    // Fetch groups the user is a member of (GroupMember)
    const userGroups = await GroupMember.findAll({
      where: { userid },
      include: [
        {
          model: Group,
          as: 'group',  // Correct alias for Group association
          attributes: ['id', 'name'], // Group details (id and name)
        },
      ],
    });

    // Fetch groups created by the user (directly from Group)
    const createdGroups = await Group.findAll({
      where: { createdBy: userid },  // Assuming there's a 'createdBy' field in Group model
      attributes: ['id', 'name'], // Group details (id and name)
    });

    // Flatten the userGroups and createdGroups arrays to return only relevant info
    const userGroupsFormatted = userGroups.map(groupMember => ({
      groupId: groupMember.group.id,
      groupName: groupMember.group.name,
      role: groupMember.role, // Assuming 'role' is available in GroupMember model
    }));

    const createdGroupsFormatted = createdGroups.map(group => ({
      groupId: group.id,
      groupName: group.name,
      createdBy: group.createdBy,
    }));

    // Combine both user groups and created groups
    const allGroups = {
      userGroups: userGroupsFormatted,
      createdGroups: createdGroupsFormatted,
    };

    return res.status(200).json(allGroups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.addMemberToGroup = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { groupId, email } = req.body; // Expecting a single email
    const userid = req.user.id; // Ensure req.user is populated via authentication middleware

    if (!groupId || !email) {
      await transaction.rollback();
      return res.status(400).json({ message: "Group ID and member email are required." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Authorization check: Ensure requester is an admin of the group
    const requesterMembership = await GroupMember.findOne({
      where: {
        userid: userid,
        groupId: groupId,
        role: 'admin',
      },
      transaction,
    });

    if (!requesterMembership) {
      await transaction.rollback();
      return res.status(403).json({ message: "You do not have permission to add members to this group." });
    }

    // Verify group existence
    const group = await Group.findByPk(groupId, { transaction });
    if (!group) {
      await transaction.rollback();
      return res.status(404).json({ message: "Group not found." });
    }

    // Find the user by email
    const user = await Userdetails.findOne({
      where: { email },
      attributes: ['id'],
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: `User with email ${email} not found.` });
    }

    // Check if the user is already a member of the group
    const existingMember = await GroupMember.findOne({
      where: {
        groupId: groupId,
        userid: user.id,
      },
      transaction,
    });

    if (existingMember) {
      await transaction.rollback();
      return res.status(400).json({ message: "User is already a member of the group." });
    }

    // Add the user to the group with "member" role
    await GroupMember.create({
      userid: user.id,
      groupId: groupId,
      role: "member",
    }, { transaction });

    await transaction.commit();

    res.status(200).json({
      message: "Member added successfully.",
      member: { email: user.email, role: "member" },
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Error adding member to group:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


exports.makeAdmin = async (req, res) => { 
  try{
    const userid = req.user.id
    const {groupId, email} = req.body 

    //check whether the user is an admin of the group
    const admin = await GroupMember.findOne({
      where: {userid, groupId},
      attributes: ['role'],
    })

    if(admin.role !== 'admin'){
      return res.status(403).json({message: "You are not an admin of this group"})
    }

    const usertobemadeadmin = await Userdetails.findOne({
      where: {email},
      attributes: ['id']
    })

    if(!usertobemadeadmin){
      return res.status(404).json({message: "User not found"})
    }

    await GroupMember.update({role: 'admin'}, {
      where: {userid: usertobemadeadmin.id, groupId}
    })

    res.status(200).json({message: "User made admin successfully"})   

  }
  catch(error){

  }
}