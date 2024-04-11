import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import classNames from 'classnames';
import { ChangeEventHandler, useState } from 'react';

export interface SearchProps {
  dataTest?: string;
  placeholder?: string;
}

export function Search({
  placeholder,
  dataTest = 'search',
}: Readonly<SearchProps>) {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  // #region handlers
  const searchBoxChangeHandler: ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setSearchText(event.currentTarget.value);

    if (event.currentTarget.value.length === 0) {
      setIsTyping(false);
      return;
    }

    if (isTyping === false) {
      setIsTyping(true);
    }
  };
  const searchBoxCleanerHandler = () => {
    setSearchText('');
    setIsTyping(false);
  };
  // #endregion

  const iconClassNames = 'mr-4 h-6 w-6 pt-1';
  const icon = isTyping ? (
    <XMarkIcon
      onClick={searchBoxCleanerHandler}
      className={classNames(iconClassNames, 'cursor-pointer')}
      data-test="search-cleaner-button"
    />
  ) : (
    <MagnifyingGlassIcon className={iconClassNames} />
  );

  return (
    <div className="flex flex-row rounded bg-white p-3">
      {icon}
      <input
        onChange={searchBoxChangeHandler}
        value={searchText}
        type="search"
        data-test={dataTest}
        placeholder={placeholder}
        className=" w-full text-xl focus:outline-none"
      />
      {/* TODO: show results or "No matches found" */}
    </div>
  );
}
