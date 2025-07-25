import { RoleModel } from "./roleModel";

const getRole = async (params) => {
    try {
        console.log("getRole called with params:", params);
        
        if (!params.status) {
            params.status = 1;
        }

        // Handle both roleId (single) and roleIds (array) parameters
        // Only set _id if it's not already set (from rolesHandler)
        if (params.roleId && !params._id) {
            params._id = params.roleId;
            delete params.roleId;
        }

        // If _id is already set (from roleIds), don't override it
        if (params.roleIds && !params._id) {
            params._id = { $in: params.roleIds.split(',') };
            delete params.roleIds;
        }

        console.log("Final query params:", params);

        let limit: number = 100;
        let offset: number = 0;
        if (params.offset != undefined) {
            offset = +params.offset;
            delete params.offset;
        }
        if (params.limit != undefined) {
            limit = +params.limit;
            delete params.limit;
        }
        if (params.sevenshiftId) {
            params.sevenshiftId = parseInt(params.sevenshiftId);
        }

        console.log("About to call RoleModel.find with:", params);
        let result: any = await RoleModel.find(params)
                .limit(limit)
                .skip(offset)
                .sort({ roleName: 1 });
        console.log("RoleModel.find result length:", result.length);
        return result;
    } catch (error: any) {
        console.error("Error in getRole:", error);
        console.error("Error stack:", error.stack);
        
        // Check if it's a connection error
        if (error.message.includes('buffering timed out') || error.message.includes('MongoDB not connected')) {
            console.error("MongoDB connection issue detected");
            // Return empty array instead of throwing error
            return [];
        }
        
        throw new Error(error as string);
    }
};

const handleError = (err: any) => {
    return new Promise((resolve, reject) => {
        reject(err);
    });
};

export { getRole };