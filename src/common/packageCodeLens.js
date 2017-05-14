/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CodeLens, Range } from 'vscode';
import { formatWithExistingLeading } from './utils';
import appSettings from './appSettings';

export class PackageCodeLens extends CodeLens {

  constructor(commandRange, replaceRange, packageInfo, documentUrl) {
    super(commandRange);
    this.replaceRange = replaceRange || commandRange;
    this.package = packageInfo;
    this.documentUrl = documentUrl;
    this.command = null;
  }

  generateNewVersion(newVersion) {
    if (!this.package.customGenerateVersion)
      return formatWithExistingLeading(this.package.version, newVersion);

    return this.package.customGenerateVersion.call(this, this.package, newVersion);
  }

  getTaggedVersionPrefix() {
    if (this.package.meta.isTaggedVersion)
      return this.package.meta.tag.name + ': ';

    return '';
  }

  isInvalidVersion() {
    return this.package.meta.tag.isInvalid;
  }

  isTaggedVersion() {
    return this.package.meta.isTaggedVersion;
  }

  isFixedVersion() {
    return this.package.meta.isFixedVersion;
  }

  installsTaggedVersion() {
    return this.package.meta.tag.satisfiesTag;
  }

  getInstalledTagName() {
    return this.package.meta.tag.satisfiesTagName;
  }

  getTaggedVersion() {
    return this.package.meta.tag.version;
  }

  packageNotFound() {
    return this.package.meta.packageNotFound;
  }

  packageNotSupported() {
    return this.package.meta.packageNotSupported;
  }

  versionMatchNotFound() {
    return this.package.meta.tag.versionMatchNotFound;
  }

  getInstallIndicator() {
    return this.package.meta.isOlderVersion ?
      appSettings.revertIndicator :
      appSettings.updateIndicator;
  }

  setCommand(text, command, args) {
    this.command = {
      title: text,
      command: command || null,
      arguments: args || null
    };
    return this;
  }

}