/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         5.3.2
 */
const CLIPBOARD_OFFSCREEN_DOCUMENT_REASON = "CLIPBOARD";
const FETCH_OFFSCREEN_DOCUMENT_REASON = "WORKERS";
const OFFSCREEN_URL = "offscreens/offscreen.html";
const LOCK_CREATE_OFFSCREEN_DOCUMENT = "LOCK_CREATE_OFFSCREEN_DOCUMENT";

const IS_FIREFOX =
  typeof browser !== "undefined" &&
  browser.runtime &&
  typeof browser.runtime.getBrowserInfo === "function";

export default class CreateOffscreenDocumentService {
  /**
   * Create clipboard offscreen document if it does not exist yet.
   * @returns {Promise<void>}
   */
  static async createIfNotExistOffscreenDocument() {
    await navigator.locks.request(LOCK_CREATE_OFFSCREEN_DOCUMENT, async () => {
      if (IS_FIREFOX) {
        return false;
      }

      if (
        typeof chrome === "undefined" ||
        !chrome.runtime ||
        typeof chrome.runtime.getContexts !== "function" ||
        !chrome.offscreen ||
        typeof chrome.offscreen.createDocument !== "function"
      ) {
        return false;
      }

      const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [chrome.runtime.getURL(OFFSCREEN_URL)],
      });

      if (existingContexts && existingContexts.length > 0) {
        return true;
      }

      await chrome.offscreen.createDocument({
        url: OFFSCREEN_URL,
        reasons: [
          FETCH_OFFSCREEN_DOCUMENT_REASON,
          CLIPBOARD_OFFSCREEN_DOCUMENT_REASON,
        ],
        justification:
          "Read/write clipboard as clipboard API is unavailable in MV3 service workers. Perform requests to self hosted Passbolt instance.",
      });

      return true;
    });
  }
}
