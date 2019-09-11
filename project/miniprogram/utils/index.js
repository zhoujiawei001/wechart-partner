/**
 * 将选中时间变为hh:mm:ss
 */
export function changeSelectTime (timestamp) {
  const curTimestamp = Date.parse(new Date());
  let total_s = (timestamp - curTimestamp) / 1000;
  let hh = Math.floor(total_s / 3600);
  let mm = Math.floor((total_s % 3600) / 60);
  let ss = Math.floor(total_s % 60);
  return add_zero(hh) + ':' + add_zero(mm) + ':' + add_zero(ss)
}

// 补零方法
export function add_zero (val) {
  if (val < 10) {
    return '0' + val
  } else {
    return val + ''
  }
}