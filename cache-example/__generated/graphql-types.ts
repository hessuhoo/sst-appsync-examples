export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
};

export type Item = {
  __typename?: 'Item';
  dateTime?: Maybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
};

export type Person = {
  dateTime?: Maybe<Scalars['AWSDateTime']>;
  friendId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  kids?: Maybe<Array<Maybe<Person>>>;
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getItemById?: Maybe<Item>;
  getPersonById?: Maybe<Person>;
  listItems: Array<Item>;
};


export type QueryGetItemByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetPersonByIdArgs = {
  id: Scalars['ID'];
};
