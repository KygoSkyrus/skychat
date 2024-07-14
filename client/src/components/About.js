import React from 'react'
import logo1 from './../assets/logo/logo (1).png'

const About = () => {
    return (
        <div className='about'>
            <div className='container h-100 mt-5'>
                <h2 className='text-center '>
                    <img src={logo1} width={150} alt='' />
                </h2>

                <div class="accordion" id="aboutAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                What is SkyChat?
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                SkyChat is a versatile chat application available for both web and mobile platforms. It offers a simple and elegant design to ensure a user-friendly experience. Users can easily create an account or log in using their Google account. A unique username is required for each user, which will be visible to others and used for searching users.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Username Criteria
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                When creating a username, the following criteria must be met to ensure uniqueness and appropriateness:
                                <ul>
                                    <li>The username cannot contain blank spaces.</li>
                                    <li>The username must be at least 4 characters long.</li>
                                    <li>The username can only include lowercase letters (a-z) and numbers (0-9).</li>
                                    <li>The username cannot be solely numerical.</li>
                                    <li>The username cannot be "skychat" or contain "skychat".</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingThree">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Security and Privacy Features
                            </button>
                        </h2>
                        <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                SkyChat prioritizes user security and privacy. By default, the privacy feature is enabled when an account is created. This prevents users from receiving messages from unknown individuals. Users with privacy enabled cannot be searched through the search bar or added to groups. Users can toggle their privacy settings anytime from the settings.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingFour">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                Managing Connection Requests
                            </button>
                        </h2>
                        <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                When someone sends you a message, you will receive a connection request. You can view your connection requests by toggling the header. You have the option to accept, delete, or block a connection request. To respond to a message from a new connection, you must first accept their request.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingFive">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                Group Chats
                            </button>
                        </h2>
                        <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                SkyChat allows users to create group chats with a maximum of 25 members. Only the group admin can add or remove members. A minimum of two members is required to create a group. This feature is designed to facilitate easy and organized group communication.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingSix">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                Real-Time Messaging Features
                            </button>
                        </h2>
                        <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                SkyChat offers a real-time messaging interface with various features, including:
                                <ul>
                                    <li>Deleting messages</li>
                                    <li>Clearing chat history</li>
                                    <li>Blocking connections</li>
                                    <li>Deleting connections</li>
                                    <li>Sending emojis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingEight">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                                Blocked Connections
                            </button>
                        </h2>
                        <div id="collapseEight" class="accordion-collapse collapse" aria-labelledby="headingEight" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                Users can view connections they have blocked in the settings. This section allows users to manage their blocked list, providing options to unblock connections if desired.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingSeven">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                                Customizing Your Profile
                            </button>
                        </h2>
                        <div id="collapseSeven" class="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#aboutAccordion">
                            <div class="accordion-body">
                                In the settings, users can personalize their profiles by:
                                <ul>
                                    <li>Editing their avatar from the available collection or uploading their own image</li>
                                    <li>Viewing and managing blocked connections</li>
                                    <li>Changing the app theme</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="text-center text-secondary mt-5 fs-12">
                    © {new Date().getFullYear()} All Rights Reserved, Skychat <i className="">by</i> Dheeraj Gupta
                </section>
            </div>
        </div>
    )
}

export default About