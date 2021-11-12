export default function doesHttpOnlyCookieExist(cookiename: string): boolean {
  let d = new Date();
  d.setTime(d.getTime() + 1000);
  let expires = 'expires=' + d.toUTCString();

  document.cookie = cookiename + '=new_value;path=/;' + expires;
  if (document.cookie.indexOf(cookiename + '=') === -1) {
    return true;
  } else {
    document.cookie = `${cookiename}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
    return false;
  }
}
