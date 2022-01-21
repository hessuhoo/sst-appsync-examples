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

export type AdminItem = {
  __typename?: 'AdminItem';
  adminMessage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  secretMessage?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getAdminItem?: Maybe<AdminItem>;
  getItem?: Maybe<Item>;
  getUserItem?: Maybe<UserItem>;
};

export type UserItem = {
  __typename?: 'UserItem';
  id: Scalars['ID'];
  userMessage?: Maybe<Scalars['String']>;
};
