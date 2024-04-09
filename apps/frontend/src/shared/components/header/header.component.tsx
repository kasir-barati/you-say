'use client';

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '../logo/logo.component';
import { ModalBody } from '../modal/modal-body.component';
import { ModalHeader } from '../modal/modal-header.component';
import { Modal } from '../modal/modal.component';
import { Search } from '../search/search.component';
import { SignUpForm } from '../sign-up-form/sign-up-form.component';
import { SubscriptionForm } from '../subscription-form/subscription-form.component';

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
    <ModalBody>
      <Link
        data-test="sign-in-button"
        className="rounded-lg bg-rose-600 px-10 py-3 text-white"
        href={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`}
      >
        Continue sign in
      </Link>
      <p className="mt-5 text-center">
        Don&apos;t have an account?&nbsp;
        <button
          data-test="do-not-have-an-account-button"
          className="text-rose-600"
          onClick={signUpTogglerClickHandler}
        >
          Sign up
        </button>
      </p>
    </ModalBody>
  ) : (
    <ModalBody>
      <SignUpForm closeModalHandler={closeSignInModalHandler} />
      {/* TODO: show sign in modal or close the modal in case it case of successful singing up */}
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
    <>
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
          <button
            data-test="sign-in-button-in-header"
            aria-label="Sign in"
            onClick={signInClickHandler}
          >
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
            <ModalBody>
              <SubscriptionForm
                closeModalHandler={closeSubscriptionModalHandler}
              />
            </ModalBody>
          </Modal>
        </div>
      </header>
    </>
  );
}
