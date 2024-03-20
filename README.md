<h1 align='center'><a href='https://tuf-assignment-fe.vercel.app/'>PiCode</a></h1>
<p>

**NOTE:** might submitting API can give `400` status code, as API used is free, which has limited access

</p>

## API Endpoint (backend)

1.  ### Code Submission

    To submit the code

    <b> Endpoint URL: </b> `[POST] /submit`
    <!--  -->

    #### Parameters

    ##### Request Body

    ```js
    {
        username: String;
        language: String,
        language_id: Int,
        sourceCode: String,
        stdInput: String (optional)
    }
    ```

    #### Response

    ##### StatusCode: 200

    ```js
    {
      success: true,
      data: {
        submissionId: String
      }
    }
    ```

    ##### StatusCode: 400

    ```js
    {
      success: false,
      error: <error-msg> | String
    }
    ```

2.  ### Get all code submission

    get all submitted codes (all)

    <b> Endpoint URL: </b> `[GET] /all`

    #### Response

    ##### StatusCode: 200

    ```js
    {
      success: true,
      data: [{
            username: String,
            language: String,
            language_id: Int,
            sourceCode: String,
            stdInput: String
      }, ...
      ]}
    ```

    ##### StatusCode: 400

    ```js
    {
      success: false,
      error: <error-msg> | String
    }
    ```

3.  ### Run submission code

    To run code in [Judge](https://judge0.com/).

    <b> Endpoint URL: </b> `[POST] /run/:submissionId`
    <!--  -->

    #### Parameters

    ##### Request QueryParams

    _submissionId_: submission id of the code

    #### Response

    ##### StatusCode: 200

    ```js
    {
      success: true,
      data: {
        message: "Code running by Online Judge, Check Status"
      }
    }
    ```

    ##### StatusCode: 400

    ```js
    {
      success: false,
      error: <error-msg> | String
    }
    ```

4.  ### Check submission status

    To run code in [Judge](https://judge0.com/).

    <b> Endpoint URL: </b> `[POST] /status/:submissionId`
    <!--  -->

    #### Parameters

    ##### Request QueryParams

    _submissionId_: submission id of the code

    #### Response

    ##### StatusCode: 200

    ```js
    {
    "stdout": <code-output>,
    "status_id": Int,
    "language_id": Int,
    "stderr": String | null
    }
    ```

    ##### StatusCode: 400

    ```js
    {
      success: false,
      error: <error-msg> | String
    }
    ```
