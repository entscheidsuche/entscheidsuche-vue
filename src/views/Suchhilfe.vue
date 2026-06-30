<template>
  <div id="organization">
    <template v-if="locale==='de'">
      <h1>Suchhilfe</h1>
      <p>Die Suche auf AGHIST ist eine Volltextsuche, die mit Metadaten ergänzt werden kann. Im Suchfeld können Sie beliebige Suchbegriffe eingeben. Die Klein- und Grossschreibung spielt dabei keine Rolle, die Akzente und Umlaute hingegen schon.</p>
      <h2>Textsuche</h2>
      <h3>Trunkierung (Abkürzungen oder Platzhalter)</h3>
      <p>Suchen Sie z.B. mit dem Begriff Wald, so erhalten Sie nur Dokumente, in denen der Begriff in genau dieser Form so auch vorkommt. Dokumente, in denen bspw. Begriffe wie <i>Waldbesitzerin</i> oder <i>Gemeindewald</i> enthalten sind, werden mit der Suche nach Wald nicht gefunden. Mit dem Suchwort <i>Wald*</i> werden jedoch alle Wörter gefunden, die so beginnen. Sie können dabei auch Linkstrunkieren, d.h. <i>*Wald</i> findet auch Begriffe, wie z.B. <i>Privatwald</i>. Auch eine kombiniert Links- und Rechtstrunkierung ist möglich: Mit der Suche nach <i>*Wald*</i> finden Sie z.B. auch die <i>Laubwaldbesitzerin</i>. Auch können einzelne Buchstaben durch einen Platzhalter ersetzt werden. So findet beispielsweise die Suche nach <i>?au</i> sowohl <i>Tau</i> als auch <i>Bau</i>.</p>
      <h3>Fuzzy-Suche (Suche mit ähnlichen Begriffen, unscharfe Suche)</h3>
      <p>Begriffe können auch in ähnlicher Schreibweise gesucht werden – wenn man nach Begriffen sucht, die unterschiedlich geschrieben werden können. Dazu wird eine angefügte Tilde (~) verwendet. So findet <i>Präsident~</i> auch Präsidentin, présidente und president. Schwächere oder stärkere Abweichungen können mit <i>Präsident~1</i> oder <i>Präsident~3</i> gefunden werden. Die Fuzzy-Suche kann in einem Suchverfahren jedoch nicht mit einer Trunkierung kombiniert werden.</p>
      <h3>Logische Verknüpfung</h3>
      <p>Wenn Sie mit zwei Suchbegriffen suchen, werden diese automatisch mit <i>AND</i> verknüpft. Das bedeutet, dass beide Begriffe gleichzeitig in der Suche enthalten sein müssen. Wenn Sie Dokumente finden möchten, in denen mindestens einer der Suchbegriffe enthalten ist, verwenden Sie die <i>OR</i>-Verknüpfung. Bei den Verknüpfungsoperatoren ist die Grossschreibweise wichtig, da sie sonst als normale Suchbegriffe gesucht werden. Sie können auch <i>AND</i> und <i>OR</i>-Operatoren verbinden. So findet <i>(Besitz OR Eigentum) AND Pacht</i> alle Dokumente, die die Begriffe <i>Besitz</i> oder <i>Eigentum</i> und <i>Pacht</i> enthalten. Dabei müssen jedoch <b>ZWINGEND</b> Klammern gesetzt werden. Ohne Klammern würde der Suchbegriff <i>Besitz</i> ignoriert werden.</p>
      <p>Sie können auch nach allen Dokumenten suchen, die einen Begriff nicht enthalten. So findet bspw. die Suche <i>NOT Besitz</i> alle Dokumente, in denen der Begriff <i>Besitz</i> nicht vorkommt.</p>
      <h3>Phrasensuche</h3>
      <p>Sie können mit Anführungszeichen auch eine feste Wortfolge suchen. Mit <i>"landwirtschaftliche Schule"</i> finden Sie die Wörter genau in dieser Reihenfolge.</p>
      <h3>Distanzsuche</h3>
      <p>Suchen Sie Begriffe, die im gleichen Kontext vorkommen, können Sie das mit der Distanzsuche finden. Die Suche nach <i>"Bio Präsident"~5</i> findet jene Dokumente, in denen die beiden Begriffe im maximalen Abstand von 5 Wörtern vorkommen.</p>
      <h2>Datenschutz</h2>
      <p>Weitere Informationen zum Datenschutz finden Sie unter folgendem <a href="https://www.histoirerurale.ch/afa/index.php/de/datenschutz" target="_blank">Link</a>.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Astuces pour la recherche</h1>
      <p>La recherche sur AGHIST est conçue comme une recherche en texte intégral, qui peut être complétée par des métadonnées. Vous pouvez saisir n'importe quel terme de recherche dans le champ de recherche. Les majuscules/minuscules n'ont pas d'importance, cependant les accents sont pris en compte.</p>
      <h2>Recherche textuelle</h2>
      <h3>Troncature (abréviations ou caractères génériques)</h3>
      <p>Si vous effectuez par exemple une recherche avec le terme «Culture», vous n'obtiendrez que les documents dans lesquels ce terme apparaît exactement sous cette forme. Les documents contenant par exemple des termes tels que <i>Cultures</i> ou <i>Apiculture</i> ne seront pas trouvés avec la recherche « Culture ». Avec le mot-clé <i>Culture*</i>, tous les mots commençant ainsi seront toutefois trouvés. Vous pouvez également effectuer une troncature à gauche, c'est-à-dire que <i>*Culture</i> trouve également des termes tels que <i>Apiculture</i>. Une troncature combinée à gauche et à droite est également possible : avec la recherche <i>*culteur*</i>, vous trouverez par exemple également <i>Horticulteurs</i>. Des lettres individuelles peuvent également être remplacées par un caractère générique. Ainsi, la recherche <i>?oyer</i> trouve par exemple aussi bien <i>Foyer</i> que <i>Noyer</i>.</p>
      <h3>Recherche fuzzy (recherche avec des termes similaires, recherche approximative)</h3>
      <p>Les termes peuvent également être recherchés avec une orthographe similaire – lorsque l'on recherche des termes pouvant s'écrire différemment. Pour cela, on utilise un tilde (~) ajouté au début. Ainsi, <i>président~</i> trouve également présidente, Präsident et president. Des écarts plus ou moins importants peuvent être trouvés avec <i>président~1</i> ou <i>président~3</i>. La recherche floue ne peut toutefois pas être combinée avec un troncage dans une même opération de recherche.</p>
      <h3>Opérateurs logiques</h3>
      <p>Si vous effectuez une recherche avec deux termes, ceux-ci sont automatiquement combinés avec l'opérateur <i>AND</i>. Cela signifie que les deux termes doivent apparaître simultanément dans les résultats de recherche. Si vous souhaitez trouver des documents contenant au moins l'un des termes de recherche, utilisez l'opérateur <i>OR</i>. Pour les opérateurs de liaison, la casse est importante, sinon ils seront traités comme des termes de recherche normaux. Vous pouvez également combiner les opérateurs <i>AND</i> et <i>OR</i>. Ainsi, <i>(propriété OR possession) AND bail</i> trouve tous les documents contenant les termes <i>propriété</i> ou <i>possession</i> et <i>bail</i>. Il est toutefois <b>OBLIGATOIRE</b> d’utiliser des parenthèses. Sans parenthèses, le terme de recherche <i>propriété</i> serait ignoré.</p>
      <p>Vous pouvez également rechercher tous les documents qui ne contiennent pas un terme. Ainsi, la recherche <i>NOT possession</i> trouve par exemple tous les documents dans lesquels le terme <i>possession</i> n'apparaît pas.</p>
      <h3>Recherche de phrases</h3>
      <p>Vous pouvez également rechercher une suite de mots fixe à l'aide de guillemets. Avec <i>«école agricole»</i>, vous trouverez les mots exactement dans cet ordre.</p>
      <h3>Recherche par distance</h3>
      <p>Si vous recherchez des termes apparaissant dans le même contexte, vous pouvez les trouver à l'aide de la recherche par distance. La recherche <i>"bio président"~5</i> trouve les documents dans lesquels les deux termes apparaissent à une distance maximale de 5 mots.</p>
      <h2>Protection des données</h2>
      <p>Vous trouverez de plus amples informations sur la protection des données en cliquant sur le <a href="https://www.histoirerurale.ch/afa/index.php/fr/protection-des-donnees" target="_blank">lien</a> suivant.</p>
    </template>
    <template v-if="locale==='it'">
      <p>La versione in lingua italiana non è ancora disponibile</p>
    </template>
    <template v-if="locale==='en'">
      <h1>Search tips</h1>
      <p>The AGHIST search is designed as a full-text search, which can be supplemented by metadata. You can enter any search term in the search field. Case (upper/lower case) is not taken into account, however accents do matter. </p>
      <h2>Text search</h2>
      <h3>Truncation (abbreviations or wildcards)</h3>
      <p>If, for example, you search for the term ‘culture’, you will only find documents in which this term appears exactly as written. Documents containing terms such as <i>cultures</i> or <i>horticulture</i>, for example, will not be found using the search term ‘culture’. However, using the keyword <i>culture*</i>, all words beginning in this way will be found. You can also perform a left truncation; for example, <i>*culture</i> will also find terms such as <i>horticulture</i>. A combined left and right truncation is also possible: with the search <i>*farm*</i>, for example, you will also find <i>fishfarms</i>. Individual letters can also be replaced by a wildcard character. For example, the search <i>?rop</i> finds both <i>crop</i> and <i>drop</i>.</p>
            <h3>Fuzzy search (search using similar terms, approximate search)</h3>
      <p>Terms can also be searched for using similar spellings – when looking for terms that may be spelled differently. To do this, add a tilde (~) at the start. For example, <i>president~</i> will also find Präsident, président and présidente. Results with greater or lesser variations can be found using <i>president~1</i> or <i>president~3</i>. However, fuzzy search cannot be combined with truncation in the same search operation.</p>
      <h3>Logical operators</h3>
      <p>If you carry out a search using two terms, these are automatically combined using the <i>AND</i> operator. This means that both terms must appear together in the search results. If you wish to find documents containing at least one of the search terms, use the <i>OR</i> operator. For conjunction operators, case is significant; otherwise, they will be treated as normal search terms. You can also combine the operators <i>AND</i> and <i>OR</i>. For example, <i>(property OR possession) AND tenancy agreement</i> finds all documents containing the terms <i>property</i> or <i>possession</i> and <i>tenancy agreement</i>. However, it is <b>MANDATORY</b> to use brackets. Without brackets, the search term <i>property</i> would be ignored.</p>
            <p>You can also search for all documents that do not contain a particular term. For example, the search <i>NOT possession</i> finds all documents in which the term <i>possession</i> does not appear.</p>
      <h3>Phrase search</h3>
      <p>You can also search for a fixed sequence of words using quotation marks. With <i>“agricultural college”</i>, you will find the words in exactly that order.</p>
      <h3>Proximity search</h3>
      <p>If you are looking for terms that appear in the same context, you can find them using a proximity search. The search <i>“farmers president”~5</i> finds documents in which the two terms appear within a maximum distance of 5 words.</p>
      <h2>Data protection</h2>
      <p>You can find further information on data protection by clicking on the <a href="https://www.histoirerurale.ch/afa/index.php/en/data-protection" target="_blank">link</a> below.</p>
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
