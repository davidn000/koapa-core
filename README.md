# Koapa Core

The main core service for Koapa. It is needed to serve, create, and validate the applications. Check the [Duties](#Duties) tab for more information about the duties of Koapa core, and see [API Endpoints](#api-endpoints) tabs  for more information about endpoints, and usage.

## Duties
- Create, Modify, and Remove applications.
- Handle direct database modification and reactivity.
- Handle all applications' api endpoints.

## API Endpoints

- **POST /create-app**
    Creates a new Koapa application with specified post paramters as options.
    Ex. request:
    ```
    {
        "name": "MyAppName"
    }
    ```

