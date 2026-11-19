import React, { forwardRef } from 'react';
import { GitBranch, ExternalLink } from 'lucide-react';
import { Input, InputProps } from '../common/Input';

interface GithubInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  value?: string;
}

export const GithubInput = forwardRef<HTMLInputElement, GithubInputProps>(
  ({ value, disabled, ...props }, ref) => {
    const isValidGithub =
      value && /^https:\/\/github\.com\/[\w-]+\/[\w.-]+/.test(value);

    return (
      <div>
        <Input
          ref={ref}
          label="GitHub Repository URL"
          placeholder="https://github.com/organization/project-name"
          leftIcon={<GitBranch className="w-4 h-4" />}
          rightIcon={
            isValidGithub ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 p-1"
                title="Open repository in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : undefined
          }
          helperText="Provide the public or organization repository link containing your source code and README."
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);

GithubInput.displayName = 'GithubInput';
