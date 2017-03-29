/**
 * @DatePicker.js
 * @author jiangzhongzheng
 * @version 1.0
 * @description 日期控件
 */

(function (global, factory) {
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(factory);
  } else {
    global.DatePicker = factory();
  }
}(this, function(){
  'use strict';

  var DatePicker = function (el, options) {
    var defaults = {
      disabled: false,
      callback: function () {}
    };

    var date = new Date();
    var title = {
      year: date.getFullYear(),
      month: date.getMonth() + 1
    }
    var state = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate()
    }

    var params = {};
    options = options || {};

    for (var key in defaults) {
      params[key] = defaults[key];
    }

    if (typeof options === 'function') {
      params.callback = options;
    } else {
      for (var o in options) {
        if (options.hasOwnProperty(o)) {
          params[o] = options[o];
        }
      }
    }

    var sdate;
    if (params.startDate) {
      sdate = params.startDate.split('-');
    }

    var edate;
    if (params.endDate) {
      edate = params.endDate.split('-');
    }

    if (typeof el === 'string') {
      el = document.querySelector(el);
    }

    el.innerHTML = '';

    var thead = (function(){
      var theadContent = ['一', '二', '三', '四', '五', '六', '日'];
      var theadEl = createEl('thead');
      var tr = createEl('tr');
      var th;
      var thNum = 0;

      for (; thNum < theadContent.length; ++thNum) {
        th = createEl('th');
        th.textContent = theadContent[thNum];
        tr.appendChild(th);
      }

      theadEl.appendChild(tr);
      return theadEl;
    })();

    var setTD = function (n) {
      var td = createEl('td');
      var a = createEl('a');
      var span = createEl('span');
      var isSpan = false;
      if (n !== 0) {
        if (params.startDate) {
          if (isOverdue([title.year, title.month, n], sdate, true)) {
            isSpan = true;
          }
        }

        if (params.endDate) {
          if (isOverdue([title.year, title.month, n], edate, false)) {
            isSpan = true;
          }
        }

        if (params.disabled) {
          isSpan = true;
        }

        if (isSpan) {
          span.textContent = n;
          span.className = 'unselect';
          td.className = 'date-unselect date-disabled';
          td.appendChild(span);
          return td;
        }
        a.href = '#';
        a.className = 'date-select';
        if (state.year === title.year && state.month === title.month && state.date === n) {
          a.className = 'date-select is-active';
        }
        a.textContent = n;
        a.dataset.index = n;
        td.appendChild(a);
      } else {
        td.className = 'date-unselect date-disabled';
      }

      return td;
    }

    var setTable = function (day, week) {
      var week = (week === 0) ? 7 : week;
      var len = Math.ceil((week-1+day)/7);
      var w = 7;
      var i = 0;
      var j = 0;
      var d = 0;
      var max = 0;
      var table = createEl('table');
      var tbody = createEl('tbody');
      var tr;

      for (; i < len; i++) {
        tr = createEl('tr');
        j = 0;
        for (; j < w; j++) {
          ++max;

          if (max < week || d >= day) {
            tr.appendChild(setTD(0));
            continue;
          }

          tr.appendChild(setTD(++d));
        }
        tbody.appendChild(tr);
      }

      table.appendChild(thead);
      table.appendChild(tbody);
      return table;
    }

    var dom = function () {
      var boxEl = createEl('div', 'datetime');
      var headerEl = createEl('div', 'date-header');
      var prevEl = createEl('a', 'date-prev');
      var nextEl = createEl('a', 'date-next');
      var titleEl = createEl('div', 'date-title');
      var yearEl = createEl('span', 'date-year');
      var monthEl = createEl('span', 'date-month');
      var tableBoxEl = createEl('div');

      var handle = function (year, month) {
        tableBoxEl.innerHTML = ''
        var date = new Date(year, month - 1, 1);
        var table = setTable(getMonth(year, month).day, date.getDay());
        tableBoxEl.appendChild(table);
      }

      var update = function (datetime) {
        if (datetime) {
          datetime = datetime.split('-');
          datetime[0] = parseInt(datetime[0]);
          datetime[1] = parseInt(datetime[1]);
          datetime[2] = parseInt(datetime[2]);

          if (params.startDate) {
            if (isOverdue(datetime, sdate, true)) {
              datetime[0] = state.year;
              datetime[1] = state.month;
              datetime[2] = state.date;
            }
          }

          if (params.endDate) {
            if (isOverdue(datetime, edate, false)) {
              datetime[0] = state.year;
              datetime[1] = state.month;
              datetime[2] = state.date;
            }
          }
          title.year = state.year = parseInt(datetime[0]);
          title.month = state.month = parseInt(datetime[1]);
          title.date = state.date = parseInt(datetime[2]);  
        }
        yearEl.textContent = title.year;
        monthEl.textContent = getMonth(title.year, title.month).month;
        handle(title.year, title.month);
      }

      yearEl.textContent = title.year;
      monthEl.textContent = getMonth(title.year, title.month).month;
      headerEl.appendChild(prevEl);
      headerEl.appendChild(nextEl);
      titleEl.appendChild(yearEl);
      titleEl.appendChild(monthEl);
      headerEl.appendChild(titleEl);
      boxEl.appendChild(headerEl);
      boxEl.appendChild(tableBoxEl);

      update(params.currentDate);

      boxEl.addEventListener('click', function(e){
        var target = e.target;
        var elAll = this.querySelectorAll('.date-select');
        var len = elAll.length;
        var i = 0;

        if (target.tagName) {
          if (target.classList.contains('date-select')) {
            if (!target.classList.contains('is-active')) {
              for (; i < len; i++) {
                if (elAll[i].classList.contains('is-active')) {
                  elAll[i].classList.remove('is-active');
                }
              }
              state.year = title.year;
              state.month = title.month;
              state.date = parseInt(target.dataset.index);
              target.classList.add('is-active');
            }
            params.callback(state);
            e.preventDefault();
            return;
          } else if (target.className === 'date-next') {
            if (title.month === 12) {
              yearEl.textContent = ++title.year;
            }
            title.month = ++title.month % 13 || 1
          } else if (target.className === 'date-prev') {

            if (title.month > 1) {
              --title.month;
            } else {
              yearEl.textContent = --title.year;
              title.month = 12;
            }
          } else {
            return;
          }

          monthEl.textContent = getMonth(title.year, title.month).month;
          handle(title.year, title.month);
        }
      });
      el.appendChild(boxEl);
      return update;
    }
    return dom();
  };

  function createEl (el, className) {
    var el =  document.createElement(el);
    if (className) {
      el.className = className;
    }
    return el;
  }

  function isOverdue (cdate, odate, type) {
    if (type) {
      if (cdate[0] == odate[0] && cdate[1] == odate[1] && cdate[2] < odate[2]) {
        return true;
      } else if (cdate[0] == odate[0] && cdate[1] < odate[1]) {
        return true;
      } else if (cdate[0] < odate[0]) {
        return true;
      }   
    } else {
      if (cdate[0] == odate[0] && cdate[1] == odate[1] && cdate[2] > odate[2]) {
        return true;
      } else if (cdate[0] == odate[0] && cdate[1] > odate[1]) {
        return true;
      } else if (cdate[0] > odate[0]) {
        return true;
      }     
    }
    return false;
  }

  function getMonth (year, Month) {
    switch (Month) {
      case 1:
        return {day: 31, month: '一月'}
        break;
      case 2:
        return {day: (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) ? 29 : 28, month: '二月'}
        break;
      case 3:
        return {day: 31, month: '三月'}
        break;
      case 4:
        return {day: 30, month: '四月'}
        break;
      case 5:
        return {day: 31, month: '五月'}
        break;
      case 6:
        return {day: 30, month: '六月'}
        break;
      case 7:
        return {day: 31, month: '七月'}
        break;
      case 8:
        return {day: 31, month: '八月'}
        break;
      case 9:
        return {day: 30, month: '九月'}
        break;
      case 10:
        return {day: 31, month: '十月'}
        break;
      case 11:
        return {day: 30, month: '十一月'}
        break;
      case 12:
        return {day: 31, month: '十二月'}
        break;
      default:
        break;
    }
  }

  return DatePicker;
}));
