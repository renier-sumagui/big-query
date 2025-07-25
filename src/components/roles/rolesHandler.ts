import { logger } from "../../utils/logger";
import * as rolesController from "./rolesController";

const getRoleByIds = async (params: any) => {
    try {
        console.log("getRoleByIds called with params:", params);
        
        const query: any = {};

        if (params.roleIds) {
            query._id = { $in: (params.roleIds as string).split(',') };
            delete params.roleIds;
        }

        console.log("Query for roles:", query);

        const response: any = await rolesController.getRole(query);
        console.log("Roles response length:", response.length);

        return response;
    } catch(err: any) {
        console.error("Error in getRoleByIds:", err);
        console.error("Error stack:", err.stack);
        // logger.error({
        //     type: 'getRoleByIds error encountered',
        //     body: err
        // })

        throw new Error(err as string);
    }
}

export { getRoleByIds };