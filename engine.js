'format cjs';

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var rightPad = require('right-pad');
var chalk = require('chalk');

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

var headerLength = function(answers) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
  );
};

var maxSummaryLength = function(options, answers) {
  return options.maxHeaderWidth - headerLength(answers);
};

var filterSubject = function(subject) {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject =
      subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function(options) {
  var types = options.types;

  var length = longest(Object.keys(types)).length + 1;
  var choices = map(types, function(type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key
    };
  });

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: '请选择您的提交类型：',
          choices: choices,
          default: options.defaultType
        },
        {
          type: 'input',
          name: 'subject',
          message: function(answers) {
            return (
              '请用简短、具体的描述说明您的修改（不超过' +
              maxSummaryLength(options, answers) +
              '个字符)：\n'
            );
          },
          default: options.defaultSubject,
          validate: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            return filteredSubject.length == 0
              ? '必须填写描述'
              : filteredSubject.length <= maxSummaryLength(options, answers)
              ? true
              : '描述需小于' +
                maxSummaryLength(options, answers) +
                '个字符，当前您输入了' +
                filteredSubject.length +
                '个字符。';
          },
          transformer: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            var color =
              filteredSubject.length <= maxSummaryLength(options, answers)
                ? chalk.green
                : chalk.red;
            return color('(' + filteredSubject.length + ') ' + subject);
          },
          filter: function(subject) {
            return filterSubject(subject);
          }
        },
        {
          type: 'input',
          name: 'issues',
          message: function() {
            return '添加关联的任务编号（如：123）：\n';
          },
          default: options.defaultIssues ? options.defaultIssues : undefined,
          validate: function(issue) {
            var filteredIssues = filterSubject(issue);
            return filteredIssues.length == 0 ? '必须关联编号' : true;
          }
        }
      ]).then(function(answers) {
        var wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth
        };

        // Wrap issue number with #
        var issues = answers.issues
          ? answers.issues.indexOf('#') >= 0
            ? answers.issues + ' '
            : '#' + answers.issues + ' '
          : '';

        // Hard limit this line
        var head = issues + answers.type + ' ' + answers.subject;

        commit(head);
      });
    }
  };
};
