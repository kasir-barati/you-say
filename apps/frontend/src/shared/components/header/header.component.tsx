'use client';

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import Link from 'next/link';
import { useState } from 'react';
import { PrimaryButton } from '../buttons/primary-button.component';
import { Input } from '../input/input.component';
import { Label } from '../label/label.component';
import { Logo } from '../logo/logo.component';
import { ModalBody } from '../modal/modal-body.component';
import { ModalHeader } from '../modal/modal-header.component';
import { Modal } from '../modal/modal.component';
import { Search } from '../search/search.component';

export function Header() {
  const [isSignInForm, setIsSignInForm] = useState<boolean>(true);
  const [isSearchModalOpen, setIsSearchModalOpen] =
    useState<boolean>(false);
  const [isSignInModalOpen, setIsSignInModalOpen] =
    useState<boolean>(false);
  const [isSubscriptionModelOpen, setIsSubscriptionModelOpen] =
    useState<boolean>(false);

  // #region handlers
  const searchClickHandler = () => {
    setIsSearchModalOpen(true);
  };
  const closeSearchModalHandler = () => {
    setIsSearchModalOpen(false);
  };
  const signInClickHandler = () => {
    setIsSignInModalOpen(true);
  };
  const closeSignInModalHandler = () => {
    setIsSignInModalOpen(false);
    setIsSignInForm(true);
  };
  const subscriptionClickHandler = () => {
    setIsSubscriptionModelOpen(true);
  };
  const closeSubscriptionModalHandler = () => {
    setIsSubscriptionModelOpen(false);
  };
  const signUpTogglerClickHandler = () => {
    setIsSignInForm(false);
  };
  const signInTogglerClickHandler = () => {
    setIsSignInForm(true);
  };
  // #endregion

  const singInModalHeaderTitle = isSignInForm ? 'Sign in' : <Logo />;
  const signInModalBody = isSignInForm ? (
    <ModalBody className="flex flex-col gap-2 text-left">
      <Label
        htmlFor="sign-in-email-input"
        data-test="sign-in-email-label"
      >
        Email
      </Label>
      <Input
        id="sign-in-email-input"
        type="email"
        dataTest="sign-in-email-input"
        placeholder="sara@example.com"
      />
      <PrimaryButton
        data-test="continue-sign-in-button"
        className="mt-5"
      >
        Continue
      </PrimaryButton>
      <p className="mt-2 text-center">
        Don&apos;t have an account?&nbsp;
        <button
          className="text-rose-600"
          onClick={signUpTogglerClickHandler}
        >
          Sign up
        </button>
      </p>
    </ModalBody>
  ) : (
    <ModalBody className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="sign-up-first-name-input"
          dataTest="sign-up-first-name-label"
        >
          Name
        </Label>
        <Input
          id="sign-up-first-name-input"
          type="text"
          dataTest="sign-up-first-name-input"
          placeholder="Michael Junior"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="sign-up-email-input"
          dataTest="sign-up-email-label"
        >
          Email
        </Label>
        <Input
          id="sign-up-email-input"
          type="email"
          dataTest="sign-up-email-input"
          placeholder="michael.junior@example.com"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="sign-up-last-name-input"
          dataTest="sign-up-last-name-label"
        >
          Last name
        </Label>
        <Input
          id="sign-up-last-name-input"
          type="text"
          dataTest="sign-up-last-name-input"
          placeholder="michael.junior@example.com"
        />
      </div>
      <PrimaryButton
        data-test="continue-sign-in-button"
        className="mt-5"
      >
        Sign up
      </PrimaryButton>
      <p className="mt-2 text-center">
        Already a member?&nbsp;
        <button
          className="text-rose-600"
          onClick={signInTogglerClickHandler}
        >
          Sign in
        </button>
      </p>
    </ModalBody>
  );

  return (
    <header
      data-test="header"
      className="flex justify-between bg-white py-7 text-center"
    >
      <div className="mx-7 flex gap-6 pt-1 text-black">
        <Link data-test="home-link" href="/">
          Home
        </Link>
        <Link data-test="about-link" href="/about">
          About
        </Link>
      </div>
      <Link
        href="/"
        aria-label="Index page"
        data-test="logo-link"
        className={'text-3xl'}
      >
        <Logo />
      </Link>
      <div className="mx-7 flex gap-6 pt-1">
        <button aria-label="search" onClick={searchClickHandler}>
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
        <Modal
          open={isSearchModalOpen}
          dataTest="search-modal"
          onClose={closeSearchModalHandler}
        >
          <ModalBody dataTest="search-modal-body">
            <Search
              dataTest="search-modal-input"
              placeholder="Search posts, tags, and authors"
            />
          </ModalBody>
        </Modal>
        <button aria-label="Sign in" onClick={signInClickHandler}>
          Sign in
        </button>
        <Modal
          open={isSignInModalOpen}
          dataTest="sign-in-modal"
          onClose={closeSignInModalHandler}
        >
          <ModalHeader
            closeButton={true}
            title={singInModalHeaderTitle}
            onClick={closeSignInModalHandler}
            closeButtonDataTest="sign-in-close-button-in-modal-header"
          />
          {signInModalBody}
        </Modal>
        <button
          aria-label="Subscribe"
          onClick={subscriptionClickHandler}
          className="rounded-full bg-rose-600 px-6 py-2 text-white"
        >
          Subscribe
        </button>
        <Modal
          open={isSubscriptionModelOpen}
          dataTest="subscription-modal"
          onClose={closeSubscriptionModalHandler}
        >
          <ModalHeader
            title={<Logo />}
            closeButton={true}
            onClick={closeSubscriptionModalHandler}
            closeButtonDataTest="subscription-close-button-in-modal-header"
          />
          <ModalBody className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="sign-up-first-name-input"
                dataTest="sign-up-first-name-label"
              >
                Name
              </Label>
              <Input
                id="sign-up-first-name-input"
                type="text"
                dataTest="sign-up-first-name-input"
                placeholder="Michael Junior"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="sign-up-email-input"
                dataTest="sign-up-email-label"
              >
                Email
              </Label>
              <Input
                id="sign-up-email-input"
                type="email"
                dataTest="sign-up-email-input"
                placeholder="michael.junior@example.com"
              />
            </div>
            <PrimaryButton
              data-test="continue-sign-in-button"
              className="mt-5"
            >
              Subscribe
            </PrimaryButton>
          </ModalBody>
        </Modal>
      </div>
    </header>
  );
}
