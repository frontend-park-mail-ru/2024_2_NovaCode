import { View } from '../../view.js';
import { PlaylistView } from '../../components/playlist/playlist.js';
import { ArtistView } from '../../components/artist/artist.js';
import { API_URL } from '../../app/config.js';
import { Ajax } from '../../modules/ajax.js';

export class FeedView extends View {

    /**
     * Initializes the FeedView instance with the given router.
     * 
     * @param {Router} router - The router instance used for navigation.
     */
    constructor(router) {
        super(router);
        this.root = document.querySelector('#root');
    }

    /**
     * Renders the feed view by displaying recommended playlist and an artists.
     */
    render() {
        const messageBox = document.createElement('div');
        messageBox.id = 'message-box';
        this.root.appendChild(messageBox);

        this.renderPlaylists(messageBox);

        this.renderArtists(messageBox);
    }

    /**
     * Renders the playlists after retrieving them via an API request.
     * Displays an error message if the request fails.
     * 
     * @param {HTMLElement} messageBox - The element used to display error or success messages.
     * @async
     */
    async renderPlaylists(messageBox) {
        try {
            const response = await this.playlistsRequest();
            const playlists = this.handleLoginResponse(response, messageBox);
            const playlist = new PlaylistView(playlists[0]);
            playlist.render();
        } catch (error) {
            this.displayMessage(
                messageBox,
                "An error occurred during playlist loading. Please try again later.",
                "error",
            );
            console.error("Error during playlist loading:", error);
        }
    }

    /**
     * Makes an API request to retrieve playlists.
     * 
     * @returns {Promise<Object>} The response from the API.
     * @async
     */
    async playlistsRequest() {
        const url = `${API_URL}/api/v1/track/all`;
        return await Ajax.get(url);
    }

    /**
     * Handles the response of the playlist API request.
     * Displays an error message if the response indicates failure.
     * 
     * @param {Object} response - The response from the API.
     * @param {HTMLElement} messageBox - The element used to display error or success messages.
     * @returns {Object} The playlists data if the request was successful.
     */
    handlePlaylistsResponse(response, messageBox) {
        if (response.status === 200) {
            return (response.body);
        } else {
            this.displayMessage(
                messageBox,
                response.body.error || "Login failed",
                "error",
            );
        }
    }

    /**
     * Renders the artists after retrieving them via an API request.
     * Displays an error message if the request fails.
     * 
     * @param {HTMLElement} messageBox - The element used to display error or success messages.
     * @async
     */
    async renderArtists(messageBox) {
        try {
            const response = await this.playlistsRequest();
            const artists = this.handleLoginResponse(response, messageBox);
            const artistElement = document.createElement('div');
            this.root.appendChild(artistElement);
            const artist = new ArtistView(artistElement, artists);
            artist.render();
        } catch (error) {
            this.displayMessage(
                messageBox,
                "An error occurred during artists loading. Please try again later.",
                "error",
            );
            console.error("Error during artists loading:", error);
        }
    }

    /**
     * Makes an API request to retrieve artists.
     * 
     * @returns {Promise<Object>} The response from the API.
     * @async
     */
    async artistsRequest() {
        const url = `${API_URL}/api/v1/artist/all`;
        return await Ajax.get(url);
    }

    /**
     * Handles the response of the artists API request.
     * Displays an error message if the response indicates failure.
     * 
     * @param {Object} response - The response from the API.
     * @param {HTMLElement} messageBox - The element used to display error or success messages.
     * @returns {Object} The artists data if the request was successful.
     */
    handleArtistsResponse(response, messageBox) {
        if (response.status === 200) {
            return (response.body);
        } else {
            this.displayMessage(
                messageBox,
                response.body.error || "Login failed",
                "error",
            );
        }
    }

    /**
     * Displays a message in the message box with a success or error style.
     * 
     * @param {HTMLElement} messageBox - The element used to display the message.
     * @param {string} message - The message content.
     * @param {string} type - The message type ('success' or 'error').
     */
    displayMessage(messageBox, message, type) {
        messageBox.textContent = message;
        messageBox.className =
            type === "success" ? "message-success" : "message-error";
    }

}
