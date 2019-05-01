// Thanks to GitHub User qm3ster for this implementation!
// https://gist.github.com/s-panferov/5269524dcf23dad9a1ef#gistcomment-2828461

export interface BaseResult<T, E> {
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
  ok(): T | undefined;
  err(): E | undefined;
  map<U>(fn: (val: T) => U): Result<U, E>;
  mapErr<U>(fn: (err: E) => U): Result<T, U>;
  and<U>(res: Result<U, E>): Result<U, E>;
  andThen<U>(op: (val: T) => Result<U, E>): Result<U, E>;
  or(res: Result<T, E>): Result<T, E>;
  orElse<U>(op: (err: E) => Result<T, U>): Result<T, U>;
  unwrap(): T | never;
  unwrapOr(optb: T): T;
  unwrapOrElse(op: (err: E) => T): T;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> implements BaseResult<T, E> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  map<U>(fn: (a: T) => U) {
    return new Ok<U, E>(fn(this.value));
  }

  mapErr<U>() {
    return (this as unknown) as Ok<T, U>;
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  ok(): T {
    return this.value;
  }

  err(): undefined {
    return undefined;
  }

  and<U>(res: Result<U, E>) {
    return res;
  }

  andThen<U>(op: (val: T) => Result<U, E>) {
    return op(this.value);
  }

  or() {
    return this;
  }

  orElse<U>() {
    return (this as unknown) as Ok<T, U>;
  }

  unwrapOr() {
    return this.value;
  }

  unwrapOrElse() {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  toString() {
    return 'Some ' + this.value;
  }
}

export class Err<T, E> implements BaseResult<T, E> {
  private error: E;

  constructor(error: E) {
    this.error = error;
  }

  map<U>() {
    return (this as unknown) as Err<U, E>;
  }

  mapErr<U>(fn: (a: E) => U) {
    return new Err<T, U>(fn(this.error));
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  ok(): undefined {
    return undefined;
  }

  err(): E {
    return this.error;
  }

  and<U>(_res: Result<U, E>) {
    return (this as unknown) as Err<U, E>;
  }

  andThen<U>(_op: (val: T) => Result<U, E>) {
    return (this as unknown) as Err<U, E>;
  }

  or(res: Result<T, E>) {
    return res;
  }

  orElse<U>(op: (err: E) => Result<T, U>) {
    return op(this.error);
  }

  unwrapOr(optb: T) {
    return optb;
  }

  unwrapOrElse(op: (err: E) => T) {
    return op(this.error);
  }

  unwrap(): never {
    throw this.error;
  }

  toString() {
    return 'None';
  }
}
