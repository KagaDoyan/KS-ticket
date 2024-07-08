import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const response = {
    SuccessResponse: (ctx: any, data: any) => {
        ctx.set.status = 200
        return {
            status: "success",
            data: data
        }
    },

    ErrorResponse: (set: any, error: any) => {
        if (error instanceof PrismaClientKnownRequestError) {
            // Handle Prisma errors
            const errorMessage = getPrismaErrorMessage(error);
            console.error(errorMessage);
            set.status = errorMessage.status
            return errorMessage
        } else {
            return error
        }
    }
}

function getPrismaErrorMessage(error: any) {
    let message = '';
    let status = 400

    switch (error.code) {
        case 'P2000':
            message = 'The provided value for the column is too long.';
            break;
        case 'P2001':
            status = 404
            message = 'record not found.';
            break;
        case 'P2002':
            message = 'A unique constraint violation occurred. The specified value already exists.';
            break;
        case 'P2003':
            status = 422
            message = 'Foreign key constraint failed.';
            break;
        case 'P2004':
            status = 422
            message = 'A constraint failed on the database.';
            break;
        case 'P2005':
            message = 'The value stored in the database for the field is invalid.';
            break;
        case 'P2006':
            message = 'The provided value is not valid.';
            break;
        case 'P2007':
            message = 'Data validation error.';
            break;
        case 'P2008':
            status = 422
            message = 'Failed to parse the query.';
            break;
        case 'P2009':
            status = 422
            message = 'Failed to validate the query.';
            break;
        case 'P2010':
            message = 'Raw query failed. Please check the query syntax and parameters.';
            break;
        case 'P2011':
            message = 'Null constraint violation.';
            break;
        case 'P2012':
            message = 'Missing a required value.';
            break;
        case 'P2013':
            message = 'Missing the required argument for the field.';
            break;
        case 'P2014':
            message = 'The change you are trying to make would violate the required relation between the records.';
            break;
        case 'P2015':
            message = 'A related record could not be found.';
            break;
        case 'P2016':
            message = 'Query interpretation error.';
            break;
        case 'P2017':
            message = 'The records for relation violate the required relation between the records.';
            break;
        case 'P2018':
            message = 'The required connected records were not found.';
            break;
        case 'P2019':
            message = 'Input error.';
            break;
        case 'P2020':
            message = 'Value out of range for the type.';
            break;
        case 'P2021':
            status = 422
            message = 'The table does not exist in the current database.';
            break;
        case 'P2022':
            status = 422
            message = 'The column does not exist in the current database.';
            break;
        case 'P2023':
            status = 422
            message = 'Inconsistent column data.';
            break;
        case 'P2024':
            status = 408
            message = 'Timed out while fetching a record.';
            break;
        case 'P2025':
            message = 'An operation failed because it depends on one or more records that were required but not found.';
            break;
        case 'P2026':
            message = 'The current database provider does not support the specified operation.';
            break;
        case 'P2027':
            message = 'Multiple errors occurred during the operation.';
            break;
        default:
            status = 500
            message = 'An unknown error occurred.';
            break;
    }

    return {
        message: `${message} Details: ${error.meta ? JSON.stringify(error.meta.target) : 'No additional details available.'}`,
        status: status,
    };
}