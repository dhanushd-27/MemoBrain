export const generateUrl = () => {
  const set = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

  const length = set.length;

  let url = "";

  for(let i = 0; i < 7; i++) {
    const random = Math.floor(Math.random() * length);
    url = url + set[random];
  }

  return url;
}