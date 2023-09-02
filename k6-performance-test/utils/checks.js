import { check } from "k6";

function checkResponseWithResponseCode(resourceResponse, endpoint, user) {
  check(resourceResponse, {
    "Verify Response Code": (r) => r.status === 200,
  });
  writeStatus(user, endpoint, resourceResponse.status);
}

export function writeStatus(user, endpoint, status) {
  let consoleStatus = `User ${user}: ${endpoint} Response Status: ${status}`;
  console.log(consoleStatus);
}

export {checkResponseWithResponseCode };
