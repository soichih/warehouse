<template>
<div v-if="id">
    <!--from https://creativecommons.org/licenses/-->
    <div v-if="id == 'ccby.40'">
        <img src="//i.creativecommons.org/l/by/4.0/88x31.png" class="logo"/>
        <span>CC BY 4.0 - Creative Commons  / Attribution 4.0 International</span>
        <p class="text">
            This license lets others distribute, remix, tweak, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.  
            <a target="license" href="//creativecommons.org/licenses/by/4.0/">More ...</a>
        </p>
    </div>
    <div v-else-if="id == 'ccbysa.30'">
        <img src="//i.creativecommons.org/l/by-sa/3.0/88x31.png" class="logo"/>
        <span>CC BY-SA 3.0 - Creative Commons  / Attribution-ShareAlike 3.0 Unported</span>
        <p class="text">
            This license lets others remix, tweak, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects.
            <a target="license" href="//creativecommons.org/licenses/by-sa/3.0/">More ...</a>
        </p>
    </div>
    <div v-else-if="id == 'cc0'">
        <img src="//i.creativecommons.org/p/zero/1.0/88x31.png" class="logo" alt="CC0">
        <span>CC0 - Creative Commons / Public Domain Dedication</span>
        <p class="text">
            CC0 enables scientists, educators, artists and other creators and owners of copyright- or database-protected content to waive those interests in their works and thereby place them as completely as possible in the public domain, so that others may freely build upon, enhance and reuse the works for any purposes without restriction under copyright or database law.
            <a target="license" href="//creativecommons.org/share-your-work/public-domain/cc0">More ..</a>
        </p>
    </div>

    <!--https://opendatacommons.org/licenses/-->
    <div v-else-if="id == 'pddl'">
        <span>PDDL - Open Data Commons / Public Domain Dedication and License</span>
        <p class="text">
            The Open Data Commons – Public Domain Dedication & Licence is a document intended to allow you to freely share, modify, and use this work for any purpose and without any restrictions. This licence is intended for use on databases or their contents (“data”), either together or individually.
            <a target="license" href="//opendatacommons.org/licenses/pddl/">More ...</a>
        </p>
    </div>

    <div v-else-if="id == 'pd'">
        <img src="https://i.creativecommons.org/p/mark/1.0/88x31.png" class="logo"/>
        <span>PD - Public Domain</span>
        <p class="text">
            It is free for use by anyone for any purpose without restriction under copyright law. Public domain is the purest form of open/free, since no one owns or controls the material in any way. 
            <a target="license" href="https://wiki.creativecommons.org/wiki/public_domain">More ...</a>
        </p>
    </div>

    <div v-else-if="id == 'odc.by'">
        <span>ODC BY 1.0 - Open Data Commons / Attribution for Data/Databases</span>
        <p class="text">
            The Open Data Commons Attribution License is a license agreement intended to allow users to freely share, modify, and use this Database subject only to the attribution requirements set out in Section 4. 
            <a target="license" href="//opendatacommons.org/licenses/by/">More ...</a>
        </p>
    </div>

    <div v-else>
        Unknown License : {{id}}
    </div>
</div>
</template>

<script>
import Vue from 'vue'

export default {
    props: {
        id: String,
    }
}
</script>

<style scoped> 
img.logo {
float: right;
opacity: 0.7;
margin-left: 15px;
margin-bottom: 5px;
}
p.text {
opacity: 0.7;
font-size: 95%;
font-style: italic;
}
</style>
