var chai = require('chai');
var chalk = require('chalk');
var engine = require('./engine');
var mock = require('mock-require');
var semver = require('semver');

var types = require('@fieldtech/conventional-commit-types-zh-cn').types;

var expect = chai.expect;
chai.should();

var defaultOptions = {
  types,
  maxLineWidth: 100,
  maxHeaderWidth: 100
};

var type = 'func';
var subject = 'testing123';
var longBody =
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a';
var issues = 'a issues is not a person that kicks things';

describe('commit message', function() {
  it('only header', function() {
    expect(
      commitMessage({
        type,
        subject
      })
    ).to.equal(`${type} ${subject}`);
  });
  it('header, issues', function() {
    expect(
      commitMessage({
        type,
        subject,
        issues
      })
    ).to.equal('#' + `${issues} ${type} ${subject}`);
  });
});

describe('validation', function() {
  it('subject exceeds max length', function() {
    expect(() =>
      commitMessage({
        type,
        subject: longBody
      })
    ).to.throw(
      '描述需小于' + `${defaultOptions.maxLineWidth - type.length - 2}`
    );
  });
  it('empty subject', function() {
    expect(() =>
      commitMessage({
        type,
        subject: ''
      })
    ).to.throw('必须填写描述');
  });
});

describe('defaults', function() {
  it('defaultType default', function() {
    expect(questionDefault('type')).to.be.undefined;
  });
  it('defaultType options', function() {
    expect(
      questionDefault('type', customOptions({ defaultType: type }))
    ).to.equal(type);
  });
  it('defaultScope default', function() {
    expect(questionDefault('scope')).to.be.undefined;
  });

  it('defaultSubject default', () =>
    expect(questionDefault('subject')).to.be.undefined);
  it('defaultSubject options', function() {
    expect(
      questionDefault(
        'subject',
        customOptions({
          defaultSubject: subject
        })
      )
    ).to.equal(subject);
  });
  it('defaultIssues default', function() {
    expect(questionDefault('issues')).to.be.undefined;
  });
  it('defaultIssues options', function() {
    expect(
      questionDefault(
        'issues',
        customOptions({
          defaultIssues: issues
        })
      )
    ).to.equal(issues);
  });
  it('disableScopeLowerCase default', function() {
    expect(questionDefault('disableScopeLowerCase')).to.be.undefined;
  });
});

describe('prompts', function() {
  it('commit subject prompt for commit w/ out scope', function() {
    expect(questionPrompt('subject', { type })).to.contain(
      `不超过${defaultOptions.maxHeaderWidth - type.length - 2}个字符`
    );
  });
});

describe('transformation', function() {
  it('subject w/ character count', () =>
    expect(
      questionTransformation('subject', {
        type,
        subject
      })
    ).to.equal(chalk.green(`(${subject.length}) ${subject}`)));
});

function commitMessage(answers, options) {
  options = options || defaultOptions;
  var result = null;
  engine(options).prompter(
    {
      prompt: function(questions) {
        return {
          then: function(finalizer) {
            processQuestions(questions, answers, options);
            finalizer(answers);
          }
        };
      }
    },
    function(message) {
      result = message;
    }
  );
  return result;
}

function processQuestions(questions, answers, options) {
  for (var i in questions) {
    var question = questions[i];
    var answer = answers[question.name];
    var validation =
      answer === undefined || !question.validate
        ? true
        : question.validate(answer, answers);
    if (validation !== true) {
      throw new Error(
        validation ||
          `Answer '${answer}' to question '${question.name}' was invalid`
      );
    }
    if (question.filter && answer) {
      answers[question.name] = question.filter(answer);
    }
  }
}

function getQuestions(options) {
  options = options || defaultOptions;
  var result = null;
  engine(options).prompter({
    prompt: function(questions) {
      result = questions;
      return {
        then: function() {}
      };
    }
  });
  return result;
}

function getQuestion(name, options) {
  options = options || defaultOptions;
  var questions = getQuestions(options);
  for (var i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.message && typeof question.message === 'string'
    ? question.message
    : question.message(answers);
}

function questionTransformation(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.transformer &&
    question.transformer(answers[name], answers, options)
  );
}

function questionFilter(name, answer, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.filter &&
    question.filter(typeof answer === 'string' ? answer : answer[name])
  );
}

function questionDefault(name, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.when(answers);
}

function customOptions(options) {
  Object.keys(defaultOptions).forEach(key => {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  });
  return options;
}
