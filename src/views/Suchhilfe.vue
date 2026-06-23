<template>
  <div id="organization">
    <template v-if="locale==='de'">
      <h1>Suchhilfe</h1>
      <p>Die Suche auf AGHIST ist eine Volltextsuche, die mit Metadaten ergänzt werden kann. Im Suchfeld können Sie beliebige Suchbegriffe eingeben. Die Klein- und
         Grossschreibung spielt dabei keine Rolle.
      </p>
      <h2>Textsuche</h2>
      <h3>Trunkierung (Abkürzungen oder Platzhalter)</h3>
      <p>Suchen Sie z.B. mit dem Begriff Wald, so erhalten Sie nur Dokumente, in denen der Begriff in genau dieser Form so auch vorkommt. Dokumente, in denen bspw. Begriffe wie <i>Waldbesitzerin</i> oder <i>Gemeindewald</i> enthalten sind, werden mit der Suche nach Wald nicht gefunden. Mit dem Suchwort <i>Wald*</i> werden jedoch alle Wörter gefunden, die so beginnen. Sie können dabei auch Linkstrunkieren, d.h. <i>*Wald</i> findet auch Begriffe, wie z.B. <i>Privatwald</i>. Auch eine kombiniert Links- und Rechtstrunkierung ist möglich: Mit der Suche nach <i>*Wald*</i> finden Sie z.B. auch die <i>Laubwaldbesitzerin</i>. Auch können einzelne Buchstaben durch einen Platzhalter ersetzt werden. So findet beispielsweise die Suche nach <i>?au</i> sowohl <i>Tau</i> als auch <i>Bau</i>.</p>
      <h3>Fuzzy-Suche (Suche mit ähnlichen Begriffen, unscharfe Suche)</h3>
      <p>Begriffe können auch in ähnlicher Schreibweise gesucht werden – wenn man nach Begriffen sucht, die unterschiedlich geschrieben werden können. Dazu wird eine angefügte Tilde (~) verwendet. So findet <i>Waldbesitzer~</i> auch Waldbesitzerin. Schwächere oder stärkere Abweichungen können mit <i>Waldbesitzer~1</i> oder <i>Waldbesitzer~3</i> gefunden werden. Die Fuzzy-Suche kann in einem Suchverfahren jedoch nicht mit einer Trunkierung kombiniert werden.</p>
      <h3>Logische Verknüpfung</h3>
      <p>Wenn Sie mit zwei Suchbegriffen suchen, werden diese automatisch mit <i>AND</i> verknüpft. Das bedeutet, dass beide Begriffe gleichzeitig in der Suche enthalten sein müssen. Wenn Sie Dokumente finden möchten, in denen mindestens einer der Suchbegriffe enthalten ist, verwenden Sie die <i>OR</i>-Verknüpfung. Bei den Verknüpfungsoperatoren ist die Grossschreibweise wichtig, da sie sonst als normale Suchbegriffe gesucht werden. Sie können auch <i>AND</i> und <i>OR</i>-Operatoren verbinden. So findet <i>(Besitz OR Eigentum) AND Pacht</i> alle Dokumente, die die Begriffe <i>Besitz</i> oder <i>Eigentum</i> und <i>Pacht</i> enthalten. Dabei müssen jedoch <b>ZWINGEND</b> Klammern gesetzt werden. Ohne Klammern würde der Suchbegriff <i>Besitz</i> ignoriert werden.</p>
      <p>Sie können auch nach allen Dokumenten suchen, die einen Begriff nicht enthalten. So findet bspw. die Suche <i>NOT Besitz</i> alle Dokumente, in denen der Begriff <i>Besitz</i> nicht vorkommt.</p>
      <h3>Phrasensuche</h3>
      <p>Sie können mit Anführungszeichen auch eine feste Wortfolge suchen. Mit <i>"landwirtschaftliche Schule"</i> finden Sie die Wörter genau in dieser Reihenfolge.</p>
      <h3>Distanzsuche</h3>
      <p>Suchen Sie Begriffe, die im gleichen Kontext vorkommen, können Sie das mit der Distanzsuche finden. Die Suche nach <i>"Enteignung Ertragswert"~5</i> findet jene Dokumente, in denen die beiden Begriffe im maximalen Abstand von 5 Wörtern vorkommen.</p>
      <h2>Datenschutz</h2>
      <p>Weitere Informationen zum Datenschutz finden Sie unter folgendem <a href="https://www.histoirerurale.ch/afa/index.php/de/datenschutz" target="_blank">Link</a>.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Aide à la recherche</h1>
      <p>La recherche sur AGHIST est conçue comme une recherche en texte intégral, qui peut être complétée par des métadonnées. Vous pouvez saisir n'importe quel terme de recherche dans le champ de recherche. La casse (majuscules/minuscules) n'a pas d'importance.</p>
      <h2>Recherche textuelle</h2>
      <h3>Troncature (abréviations ou caractères génériques)</h3>
      <p>Si vous effectuez par exemple une recherche avec le terme «Culture», vous n'obtiendrez que les documents dans lesquels ce terme apparaît exactement sous cette forme. Les documents contenant par exemple des termes tels que <i>Cultures</i> ou <i>Apiculture</i> ne seront pas trouvés avec la recherche « Culture ». Avec le mot-clé <i>Culture*</i>, tous les mots commençant ainsi seront toutefois trouvés. Vous pouvez également effectuer une troncature à gauche, c'est-à-dire que <i>*Culture</i> trouve également des termes tels que <i>Apiculture</i>. Une troncature combinée à gauche et à droite est également possible : avec la recherche <i>*culteur*</i>, vous trouverez par exemple également <i>Horticulteurs</i>. Des lettres individuelles peuvent également être remplacées par un caractère générique. Ainsi, la recherche <i>?oyer</i> trouve par exemple aussi bien <i>Foyer</i> que <i>Noyer</i>.</p>

      <h3>Recherche fuzzy (recherche avec des termes similaires, recherche approximative)</h3>
      <p>Les termes peuvent également être recherchés avec une orthographe similaire – lorsque l'on recherche des termes pouvant s'écrire différemment. Pour cela, on utilise un tilde (~) ajouté au début. Ainsi, <i>propriétaire de forêt~</i> trouve également « propriétaire de forêt ». Des écarts plus ou moins importants peuvent être trouvés avec <i>propriétaire de forêt~1</i> ou <i>propriétaire de forêt~3</i>. La recherche floue ne peut toutefois pas être combinée avec un troncage dans une même opération de recherche.</p>

      <h3>Opérateurs logiques</h3>
      <p>Si vous effectuez une recherche avec deux termes, ceux-ci sont automatiquement combinés avec l'opérateur <i>AND</i>. Cela signifie que les deux termes doivent apparaître simultanément dans les résultats de recherche. Si vous souhaitez trouver des documents contenant au moins l'un des termes de recherche, utilisez l'opérateur <i>OR</i>. Pour les opérateurs de liaison, la casse est importante, sinon ils seront traités comme des termes de recherche normaux. Vous pouvez également combiner les opérateurs <i>AND</i> et <i>OR</i>. Ainsi, <i>(propriété OR possession) AND bail</i> trouve tous les documents contenant les termes <i>propriété</i> ou <i>possession</i> et <i>bail</i>. Il est toutefois <b>OBLIGATOIRE</b> d’utiliser des parenthèses. Sans parenthèses, le terme de recherche <i>propriété</i> serait ignoré.</p>
      <p>Vous pouvez également rechercher tous les documents qui ne contiennent pas un terme. Ainsi, la recherche <i>NOT possession</i> trouve par exemple tous les documents dans lesquels le terme <i>possession</i> n'apparaît pas.</p>

      <h3>Recherche de phrases</h3>
      <p>Vous pouvez également rechercher une suite de mots fixe à l'aide de guillemets. Avec <i>«école agricole»</i>, vous trouverez les mots exactement dans cet ordre.</p>

      <h3>Recherche par distance</h3>
      <p>Si vous recherchez des termes apparaissant dans le même contexte, vous pouvez les trouver à l'aide de la recherche par distance. La recherche <i>« expropriation valeur de rendement »~5</i> trouve les documents dans lesquels les deux termes apparaissent à une distance maximale de 5 mots.</p>

      <h2>Protection des données</h2>
      <p>Vous trouverez de plus amples informations sur la protection des données en cliquant sur le <a href="https://www.histoirerurale.ch/afa/index.php/fr/protection-des-donnees" target="_blank">lien</a> suivant.</p>

    </template>
    <template v-if="locale==='it'">
      <p>La versione in lingua italiana non è ancora disponibile</p>
    </template>
    <template v-if="locale==='en'">
      <p>The english version is not available yet.</p>
    </template>
  </div>
</template>

<style lang="scss">
#organization {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Organization'
})
export default class Organization extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
