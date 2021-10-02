// Email pattern
export const EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Mật khẩu phải tối thiểu 8 kí tự, ít nhất một chữ cái và một số !
export const PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Username pattern
export const USERNAME = /^(?=[a-zA-Z0-9]{8,20}$)(?!.*[.]{2})[^.].*[^.]$/;
// tagname pattern
export const TAGNAME = /^(?=[a-zA-Z0-9]{2,20}$)(?!.*[.]{2})[^.].*[^.]$/;
// PhoneNumber
export const PHONE_NUMBER = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
// pattern query ?page 
export const PAGINATION_REGEX = /^[1-9]+$/;
// pattern URL 
// Will match the following cases
// http://www.foufos.gr
// www.mp3.com
// www.t.co
// http://t.co
export const URL_REGEX = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;
