import { CloudFunction } from '../types/function';

export const mockFunctions: CloudFunction[] = [
  {
    "name": "createAdmin",
    "description": "Create a new admin user with required authentication details",
    "parameters": [
      {
        "name": "qid",
        "type": "string",
        "required": true,
        "description": "Unique Qatar ID for the admin"
      },
      {
        "name": "name",
        "type": "{ en: string; ar: string }",
        "required": true,
        "description": "Admin name in English and Arabic"
      },
      {
        "name": "dateOfBirth",
        "type": "string | null | undefined",
        "required": false,
        "description": "Date of birth in ISO format"
      },
      {
        "name": "jobPosition",
        "type": "string | null | undefined",
        "required": false,
        "description": "Job position or title"
      },
      {
        "name": "email",
        "type": "string",
        "required": true,
        "description": "Email address for admin account"
      },
      {
        "name": "password",
        "type": "string",
        "required": true,
        "description": "Password for admin account"
      }
    ]
  },
  {
    "name": "updateAdmin",
    "description": "Update existing admin user information",
    "parameters": [
      {
        "name": "adminId",
        "type": "string | undefined",
        "required": false,
        "description": "Admin ID to update"
      },
      {
        "name": "qid",
        "type": "string",
        "required": true,
        "description": "Updated Qatar ID"
      },
      {
        "name": "name",
        "type": "{ en: string; ar: string }",
        "required": true,
        "description": "Updated name in English and Arabic"
      },
      {
        "name": "dateOfBirth",
        "type": "string | null | undefined",
        "required": false,
        "description": "Updated date of birth"
      },
      {
        "name": "jobPosition",
        "type": "string | null | undefined",
        "required": false,
        "description": "Updated job position"
      }
    ]
  },
  {
    "name": "getAdminById",
    "description": "Retrieve admin user by ID",
    "parameters": [
      {
        "name": "adminId",
        "type": "string | undefined",
        "required": false,
        "description": "Admin ID to retrieve"
      }
    ]
  },
  {
    "name": "getAllAdmins",
    "description": "Retrieve all admin users",
    "parameters": []
  },
  {
    "name": "createClient",
    "description": "Create a new client account",
    "parameters": [
      {
        "name": "name",
        "type": "{ en: string; ar: string }",
        "required": true,
        "description": "Client name in English and Arabic"
      },
      {
        "name": "contactEmail",
        "type": "string",
        "required": true,
        "description": "Primary contact email"
      },
      {
        "name": "contactPhone",
        "type": "string",
        "required": true,
        "description": "Primary contact phone number"
      },
      {
        "name": "firebaseUid",
        "type": "string",
        "required": true,
        "description": "Firebase authentication UID"
      },
      {
        "name": "logo",
        "type": "string | undefined",
        "required": false,
        "description": "URL to client logo image"
      },
      {
        "name": "company",
        "type": "{ en: string; ar: string } | null | undefined",
        "required": false,
        "description": "Company name in English and Arabic"
      },
      {
        "name": "status",
        "type": "\"ACCEPTED\" | \"REJECTED\" | \"PENDING\" | undefined",
        "required": false,
        "description": "Client approval status"
      }
    ]
  },
  {
    "name": "adminCreateClient",
    "description": "Admin-created client account with password",
    "parameters": [
      {
        "name": "name",
        "type": "{ en: string; ar: string }",
        "required": true,
        "description": "Client name in English and Arabic"
      },
      {
        "name": "contactEmail",
        "type": "string",
        "required": true,
        "description": "Primary contact email"
      },
      {
        "name": "contactPhone",
        "type": "string",
        "required": true,
        "description": "Primary contact phone number"
      },
      {
        "name": "password",
        "type": "string",
        "required": true,
        "description": "Initial password for client"
      },
      {
        "name": "logo",
        "type": "string | undefined",
        "required": false,
        "description": "URL to client logo image"
      },
      {
        "name": "company",
        "type": "{ en: string; ar: string } | null | undefined",
        "required": false,
        "description": "Company name in English and Arabic"
      }
    ]
  },
  {
    "name": "updateClient",
    "description": "Update existing client information",
    "parameters": [
      {
        "name": "clientId",
        "type": "string",
        "required": true,
        "description": "Client ID to update"
      },
      {
        "name": "name",
        "type": "{ en: string; ar: string }",
        "required": true,
        "description": "Updated client name"
      },
      {
        "name": "contactEmail",
        "type": "string",
        "required": true,
        "description": "Updated contact email"
      },
      {
        "name": "contactPhone",
        "type": "string",
        "required": true,
        "description": "Updated contact phone"
      },
      {
        "name": "firebaseUid",
        "type": "string",
        "required": true,
        "description": "Firebase authentication UID"
      },
      {
        "name": "logo",
        "type": "string | undefined",
        "required": false,
        "description": "Updated logo URL"
      },
      {
        "name": "company",
        "type": "{ en: string; ar: string } | null | undefined",
        "required": false,
        "description": "Updated company name"
      },
      {
        "name": "status",
        "type": "\"ACCEPTED\" | \"REJECTED\" | \"PENDING\" | undefined",
        "required": false,
        "description": "Updated approval status"
      }
    ]
  },
  {
    "name": "deleteClient",
    "description": "Delete a client account",
    "parameters": [
      {
        "name": "clientId",
        "type": "string",
        "required": true,
        "description": "Client ID to delete"
      }
    ]
  },
  {
    "name": "getClientById",
    "description": "Retrieve client by ID",
    "parameters": [
      {
        "name": "clientId",
        "type": "string",
        "required": true,
        "description": "Client ID to retrieve"
      }
    ]
  },
  {
    "name": "getAllClients",
    "description": "Retrieve all client accounts",
    "parameters": []
  },
  {
    "name": "approveRejectClient",
    "description": "Approve or reject a client application",
    "parameters": [
      {
        "name": "clientId",
        "type": "string",
        "required": true,
        "description": "Client ID to update status"
      },
      {
        "name": "approve",
        "type": "boolean",
        "required": true,
        "description": "True to approve, false to reject"
      }
    ]
  },
  {
    "name": "changeUserEmail",
    "description": "Change user email address",
    "parameters": [
      {
        "name": "newEmail",
        "type": "string",
        "required": true,
        "description": "New email address"
      }
    ]
  },
  {
    "name": "changeUserPhone",
    "description": "Change user phone number",
    "parameters": [
      {
        "name": "newPhone",
        "type": "string",
        "required": true,
        "description": "New phone number"
      }
    ]
  },
  {
    "name": "checkServiceStatus",
    "description": "Check service status for user",
    "parameters": [
      {
        "name": "email",
        "type": "string",
        "required": true,
        "description": "Email to check service status"
      }
    ]
  },
  {
    "name": "editUserInfo",
    "description": "Edit user profile information",
    "parameters": [
      {
        "name": "name",
        "type": "{ en: string; ar: string }",
        "required": true,
        "description": "Updated user name"
      },
      {
        "name": "picture",
        "type": "string | undefined",
        "required": false,
        "description": "Updated profile picture URL"
      }
    ]
  }
];