[#ftl/]
[#-- @ftlvariable name="tenant" type="io.fusionauth.domain.Tenant" --]
[#-- @ftlvariable name="tenantId" type="java.util.UUID" --]
[#import "_helpers.ftl" as helpers/]
[@helpers.html]

[@helpers.head title="you-say"/]

[@helpers.body]
    [@helpers.header]
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Leckerli+One&display=swap" rel="stylesheet">
    [/@helpers.header]

    [@helpers.main title="" rowClass="row center-xs" colClass="col-xs-12 col-sm-12 col-xl-6"]
        <div class="p-3 pb-5">
            <h1 class="leckerli-one-regular text-white text-5xl">you-say</h1>
            <p class="text-lg flex items-center">
                Welcome to <span class="leckerli-one-regular px-1">you-say</span> login page!
                &nbsp;
                <svg 
                    height="40" 
                    width="40" 
                    version="1.1" 
                    id="Layer_1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlns:xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 512 512" 
                    xml:space="preserve" 
                    fill="#000000"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <path style="fill:#F95428;" d="M257.015,169.407c-0.027,0-0.055,0-0.082,0c-4.089-0.044-7.368-3.395-7.323-7.484l1.677-154.599 C251.331,3.262,254.638,0,258.688,0c0.027,0,0.055,0,0.082,0c4.089,0.044,7.368,3.395,7.323,7.484l-1.677,154.599 C264.374,166.144,261.067,169.407,257.015,169.407z"></path> 
                            <path style="fill:#F95428;" d="M253.311,512c-0.027,0-0.055,0-0.082,0c-4.089-0.044-7.368-3.395-7.323-7.484l1.677-154.586 c0.044-4.062,3.35-7.324,7.402-7.324c0.027,0,0.055,0,0.082,0c4.089,0.044,7.368,3.395,7.323,7.484l-1.677,154.586 C260.669,508.738,257.362,512,253.311,512z"></path>
                            <path style="fill:#F95428;" d="M323.183,197.655c-1.923,0-3.842-0.744-5.292-2.226c-2.86-2.922-2.809-7.61,0.114-10.471 L428.509,76.827c2.922-2.859,7.611-2.808,10.471,0.114c2.86,2.922,2.809,7.61-0.114,10.471L328.361,195.543 C326.92,196.953,325.051,197.655,323.183,197.655z"></path>
                            <path style="fill:#F95428;" d="M78.314,437.285c-1.923,0-3.842-0.744-5.292-2.226c-2.86-2.922-2.809-7.61,0.114-10.471 L183.63,316.466c2.922-2.86,7.61-2.808,10.471,0.114c2.86,2.922,2.809,7.61-0.114,10.471L83.493,435.173 C82.052,436.583,80.181,437.285,78.314,437.285z"></path>
                            <path style="fill:#F95428;" d="M504.597,266.095c-0.027,0-0.055,0-0.082,0l-154.599-1.677c-4.089-0.044-7.368-3.395-7.323-7.484 c0.044-4.089,3.367-7.414,7.484-7.323l154.599,1.677c4.089,0.044,7.368,3.395,7.323,7.484 C511.954,262.832,508.648,266.095,504.597,266.095z"></path>
                            <path style="fill:#F95428;" d="M161.991,262.39c-0.027,0-0.055,0-0.082,0L7.324,260.712c-4.089-0.044-7.368-3.395-7.323-7.484 c0.044-4.089,3.438-7.372,7.484-7.323l154.585,1.677c4.089,0.044,7.368,3.395,7.323,7.484 C169.35,259.128,166.043,262.39,161.991,262.39z"></path>
                            <path style="fill:#F95428;" d="M429.881,441.09c-1.923,0-3.842-0.744-5.292-2.226L316.457,328.361 c-2.859-2.922-2.809-7.61,0.114-10.471c2.923-2.859,7.611-2.808,10.471,0.114l108.132,110.503c2.859,2.922,2.809,7.61-0.114,10.471 C433.619,440.387,431.749,441.09,429.881,441.09z"></path>
                            <path style="fill:#F95428;" d="M190.242,196.212c-1.923,0-3.842-0.744-5.292-2.226L76.827,83.491 c-2.86-2.922-2.809-7.61,0.114-10.471c2.924-2.86,7.611-2.808,10.471,0.114l108.122,110.494c2.86,2.922,2.809,7.61-0.114,10.471 C193.979,195.509,192.11,196.212,190.242,196.212z"></path>
                        </g>
                        <g>
                            <path style="fill:#F7B239;" d="M205.474,137.017c-2.709,0-5.273-1.621-6.345-4.29l-17.003-42.341 c-1.407-3.503,0.293-7.483,3.795-8.89c3.502-1.408,7.483,0.293,8.89,3.795l17.003,42.341c1.407,3.503-0.293,7.483-3.795,8.89 C207.184,136.858,206.322,137.017,205.474,137.017z"></path>
                            <path style="fill:#F7B239;" d="M323.534,430.998c-2.71,0-5.274-1.622-6.345-4.291l-16.987-42.333 c-1.406-3.503,0.295-7.483,3.798-8.888c3.503-1.406,7.483,0.295,8.888,3.798l16.987,42.333c1.406,3.503-0.295,7.483-3.798,8.888 C325.242,430.839,324.38,430.998,323.534,430.998z"></path>
                            <path style="fill:#F7B239;" d="M309.236,138.136c-0.895,0-1.804-0.177-2.68-0.55c-3.472-1.482-5.084-5.498-3.602-8.969 l17.917-41.96c1.482-3.471,5.497-5.084,8.969-3.602c3.472,1.482,5.084,5.498,3.602,8.969l-17.917,41.96 C314.416,136.58,311.891,138.136,309.236,138.136z"></path>
                            <path style="fill:#F7B239;" d="M184.84,429.496c-0.895,0-1.805-0.177-2.681-0.551c-3.472-1.482-5.084-5.498-3.601-8.969 l17.917-41.952c1.483-3.471,5.498-5.085,8.969-3.601c3.472,1.482,5.084,5.498,3.601,8.969l-17.917,41.952 C190.021,427.94,187.496,429.496,184.84,429.496z"></path>
                            <path style="fill:#F7B239;" d="M381.825,212.301c-2.709,0-5.274-1.622-6.345-4.29c-1.407-3.503,0.293-7.483,3.797-8.888 l43.223-17.352c3.503-1.408,7.483,0.293,8.888,3.797c1.407,3.503-0.293,7.483-3.797,8.888l-43.223,17.352 C383.534,212.142,382.672,212.301,381.825,212.301z"></path>
                            <path style="fill:#F7B239;" d="M87.842,330.367c-2.709,0-5.273-1.621-6.345-4.29c-1.407-3.503,0.293-7.483,3.795-8.89 l42.329-16.998c3.503-1.407,7.483,0.293,8.89,3.795c1.407,3.503-0.293,7.483-3.795,8.889l-42.329,16.998 C89.55,330.209,88.689,330.367,87.842,330.367z"></path>
                            <path style="fill:#F7B239;" d="M422.656,333.992c-0.896,0-1.805-0.177-2.681-0.551l-41.956-17.926c-3.471-1.483-5.083-5.5-3.6-8.97 c1.484-3.471,5.5-5.083,8.97-3.6l41.956,17.926c3.471,1.483,5.083,5.5,3.6,8.97C427.835,332.436,425.31,333.992,422.656,333.992z"></path>
                            <path style="fill:#F7B239;" d="M131.285,209.591c-0.895,0-1.804-0.177-2.68-0.55l-41.948-17.911 c-3.472-1.482-5.084-5.498-3.602-8.969c1.482-3.472,5.495-5.084,8.969-3.602l41.947,17.911c3.472,1.482,5.084,5.498,3.602,8.969 C136.465,208.035,133.94,209.591,131.285,209.591z"></path>
                        </g>
                        <g>
                            <circle style="fill:#31AF0E;" cx="484.846" cy="163.358" r="8.543"></circle>
                            <circle style="fill:#31AF0E;" cx="351.765" cy="27.361" r="8.543"></circle>
                            <circle style="fill:#31AF0E;" cx="161.501" cy="25.299" r="8.543"></circle>
                            <circle style="fill:#31AF0E;" cx="25.507" cy="158.38" r="8.543"></circle>
                            <circle style="fill:#31AF0E;" cx="23.445" cy="348.644" r="8.543"></circle>
                            <circle style="fill:#31AF0E;" cx="156.524" cy="484.641" r="8.543"></circle>
                            <circle style="fill:#31AF0E;" cx="346.787" cy="486.703" r="8.543"></circle>
                            <circle style="fill:#31AF0E;" cx="482.784" cy="353.622" r="8.543"></circle>
                        </g>
                        <polygon style="fill:#F7B239;" points="282.256,193.498 279.149,230.23 315.516,224.204 289.525,250.344 321.257,269.105 284.544,272.424 296.792,307.191 266.536,286.134 253.57,320.642 243.928,285.062 211.814,303.163 227.298,269.709 191.062,262.933 224.428,247.259 201.026,218.777 236.659,228.215 237.041,191.354 258.271,221.49 "></polygon>
                    </g>
                </svg>
            </p>
            <p class="text-lg">
                If you are looking for the FusionAuth admin login, you'll find a lock icon in the top right hand side which will take you there.
            </p>
        </div>
    [/@helpers.main]
    [@helpers.footer]
        [#-- Custom footer code goes here --]
        <div style="position:fixed; left:0; bottom: 0; margin-bottom: 7px; margin-left: 10px;">
            <a 
                style="color: inherit;" 
                href="https://the-praetorians.net" 
                title="Escape is impossible when you're caught in the net."
            >
                ��
            </a>
        </div>
    [/@helpers.footer]
[/@helpers.body]

[/@helpers.html]