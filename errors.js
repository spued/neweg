class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class DbError extends AppError {
}

class StatusError extends AppError {
  constructor() {
    super('Not Enable');
  }
}
class DbNoResult extends DbError {
  constructor() {
    super('No result found');
  }
}

class PasswordError extends AppError {
}

class PasswordNoMatch extends PasswordError {
  constructor() {
    super('Password don\'t match');
  }
}

class PasswordHashFailed extends PasswordError {
  constructor() {
    super('Failed to hash password');
  }
}

module.exports = {
  AppError,
  StatusError,
  DbError,
  DbNoResult,
  PasswordError,
  PasswordNoMatch,
  PasswordHashFailed,
};
